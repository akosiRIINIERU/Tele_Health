import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS configuration
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Logger
app.use('*', logger(console.log));

// Create Supabase client for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// User signup endpoint
app.post('/make-server-b415d497/signup', async (c) => {
  try {
    const { email, password, name, userType, additionalInfo } = await c.req.json();

    if (!email || !password || !name || !userType) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name,
        userType,
        status: userType === 'doctor' ? 'offline' : undefined,
        expertise: userType === 'doctor' ? additionalInfo?.specialization || '' : undefined,
        subscription: 'free',
        points: 0
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store comprehensive user profile data
    if (data.user) {
      const profileData = {
        id: data.user.id,
        name,
        email,
        userType,
        status: userType === 'doctor' ? 'offline' : 'active',
        subscription: 'free',
        points: 0,
        createdAt: new Date().toISOString(),
        ...additionalInfo
      };

      // Add specific fields based on user type
      if (userType === 'doctor') {
        profileData.expertise = additionalInfo?.specialization || 'General Practice';
        profileData.consultationFee = additionalInfo?.consultationFee || '300';
        profileData.verified = false; // Doctors need verification
      }

      await kv.set(`user_profile:${data.user.id}`, profileData);
    }

    return c.json({ message: 'User created successfully', user: data.user });
  } catch (error) {
    console.error('Signup server error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get user profile
app.get('/make-server-b415d497/profile/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user_profile:${userId}`);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Update user profile
app.put('/make-server-b415d497/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const updates = await c.req.json();

    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const existingProfile = await kv.get(`user_profile:${user.id}`);
    if (!existingProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const updatedProfile = { ...existingProfile, ...updates, updatedAt: new Date().toISOString() };
    await kv.set(`user_profile:${user.id}`, updatedProfile);

    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get available doctors
app.get('/make-server-b415d497/doctors', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const doctorProfiles = await kv.getByPrefix('user_profile:');
    const doctors = doctorProfiles
      .filter(profile => profile.userType === 'doctor')
      .map(doctor => ({
        id: doctor.id,
        name: doctor.name,
        expertise: doctor.expertise || 'General Practice',
        status: doctor.status || 'offline'
      }));

    return c.json({ doctors });
  } catch (error) {
    console.error('Get doctors error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Book appointment
app.post('/make-server-b415d497/appointments', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { doctorId, date, time, notes } = await c.req.json();

    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const appointmentId = crypto.randomUUID();
    const appointment = {
      id: appointmentId,
      patientId: user.id,
      doctorId,
      date,
      time,
      notes: notes || '',
      status: 'pending',
      cost: Math.floor(Math.random() * 6) + 5, // Random cost between 5-10 pesos
      createdAt: new Date().toISOString()
    };

    await kv.set(`appointment:${appointmentId}`, appointment);
    await kv.set(`patient_appointment:${user.id}:${appointmentId}`, appointmentId);
    await kv.set(`doctor_appointment:${doctorId}:${appointmentId}`, appointmentId);

    return c.json({ appointment });
  } catch (error) {
    console.error('Book appointment error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get user appointments
app.get('/make-server-b415d497/appointments', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userProfile = await kv.get(`user_profile:${user.id}`);
    if (!userProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const prefix = userProfile.userType === 'doctor' 
      ? `doctor_appointment:${user.id}:` 
      : `patient_appointment:${user.id}:`;
    
    const appointmentIds = await kv.getByPrefix(prefix);
    const appointments = [];

    for (const id of appointmentIds) {
      const appointment = await kv.get(`appointment:${id}`);
      if (appointment) {
        // Get additional user info
        const otherUserId = userProfile.userType === 'doctor' ? appointment.patientId : appointment.doctorId;
        const otherUserProfile = await kv.get(`user_profile:${otherUserId}`);
        
        appointments.push({
          ...appointment,
          otherUserName: otherUserProfile?.name || 'Unknown',
          otherUserType: otherUserProfile?.userType || 'unknown'
        });
      }
    }

    return c.json({ appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Update appointment status (for doctors)
app.put('/make-server-b415d497/appointments/:appointmentId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const appointmentId = c.req.param('appointmentId');
    const { status } = await c.req.json();

    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const appointment = await kv.get(`appointment:${appointmentId}`);
    if (!appointment) {
      return c.json({ error: 'Appointment not found' }, 404);
    }

    // Check if user is the doctor for this appointment
    if (appointment.doctorId !== user.id) {
      return c.json({ error: 'Not authorized to update this appointment' }, 403);
    }

    const updatedAppointment = {
      ...appointment,
      status,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`appointment:${appointmentId}`, updatedAppointment);

    return c.json({ appointment: updatedAppointment });
  } catch (error) {
    console.error('Update appointment error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Health tips endpoint
app.get('/make-server-b415d497/health-tips', async (c) => {
  try {
    const tips = [
      {
        id: 1,
        title: "Stay Hydrated",
        content: "Drink at least 8 glasses of water daily to maintain proper body function and improve skin health.",
        category: "nutrition"
      },
      {
        id: 2,
        title: "Regular Exercise",
        content: "Aim for 30 minutes of moderate exercise daily to boost immunity and cardiovascular health.",
        category: "fitness"
      },
      {
        id: 3,
        title: "Quality Sleep",
        content: "Get 7-9 hours of quality sleep each night to help your body recover and maintain mental clarity.",
        category: "wellness"
      },
      {
        id: 4,
        title: "Mindful Eating",
        content: "Include more fruits and vegetables in your diet. They provide essential vitamins and antioxidants.",
        category: "nutrition"
      },
      {
        id: 5,
        title: "Stress Management",
        content: "Practice deep breathing or meditation for 10 minutes daily to reduce stress and anxiety.",
        category: "mental-health"
      }
    ];

    return c.json({ tips });
  } catch (error) {
    console.error('Get health tips error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Articles endpoint
app.get('/make-server-b415d497/articles', async (c) => {
  try {
    const articles = [
      {
        id: 1,
        title: "Common Cold: Symptoms and Natural Remedies",
        content: "The common cold is a viral infection. Symptoms include runny nose, cough, and sore throat. Natural remedies include ginger tea, honey, and plenty of rest.",
        herbs: ["Ginger", "Honey", "Echinacea", "Garlic"],
        category: "respiratory"
      },
      {
        id: 2,
        title: "Managing Headaches Naturally",
        content: "Headaches can be caused by stress, dehydration, or tension. Try staying hydrated, getting adequate sleep, and using peppermint oil for relief.",
        herbs: ["Peppermint", "Willow bark", "Feverfew", "Lavender"],
        category: "neurological"
      },
      {
        id: 3,
        title: "Digestive Health and Stomach Issues",
        content: "Digestive problems like bloating and stomach pain can often be relieved with proper diet and herbal remedies.",
        herbs: ["Ginger", "Peppermint", "Chamomile", "Fennel"],
        category: "digestive"
      },
      {
        id: 4,
        title: "Anxiety and Stress Relief",
        content: "Natural ways to manage anxiety include regular exercise, meditation, and certain calming herbs.",
        herbs: ["Chamomile", "Lavender", "Passionflower", "Lemon balm"],
        category: "mental-health"
      }
    ];

    return c.json({ articles });
  } catch (error) {
    console.error('Get articles error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

Deno.serve(app.fetch);