const { supabase, isConfigured } = require('../config/supabase');

const inMemoryApplicants = new Map();

function serializeApplicant(record) {
  return {
    id: record.id,
    fullName: record.full_name,
    email: record.email,
    mobile: record.mobile,
    gender: record.gender || '',
    country: record.country || '',
    state: record.state || '',
    city: record.city || '',
    address: record.address || '',
    qualification: record.qualification || '',
    skills: record.skills || '',
    resumeUrl: record.resume_url || '',
    applicationStatus: record.application_status,
    paymentStatus: record.payment_status,
    profileCompletionPercent: record.profile_completion_percent,
  };
}

function toDbApplicant(payload) {
  return {
    full_name: payload.fullName,
    email: payload.email,
    mobile: payload.mobile,
    email_verified: false,
    profile_completion_percent: 20,
    application_status: 'draft',
    payment_status: 'pending',
  };
}

async function findApplicantByEmail(email) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('applicants')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (!error && data) {
        return { source: 'supabase', data };
      }
    } catch (error) {
      // fall through to in-memory fallback
    }
  }

  const record = Array.from(inMemoryApplicants.values()).find((item) => item.email === email);
  return { source: 'memory', data: record || null };
}

async function createApplicant(payload) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('applicants')
        .insert([toDbApplicant(payload)])
        .select('*')
        .single();

      if (!error && data) {
        return { source: 'supabase', data };
      }
    } catch (error) {
      // fall through to in-memory fallback
    }
  }

  const id = `local-${Date.now()}`;
  const record = {
    id,
    full_name: payload.fullName,
    email: payload.email,
    mobile: payload.mobile,
    gender: '',
    country: '',
    state: '',
    city: '',
    address: '',
    qualification: '',
    skills: '',
    resume_url: '',
    application_status: 'draft',
    payment_status: 'pending',
    profile_completion_percent: 20,
  };
  inMemoryApplicants.set(id, record);
  return { source: 'memory', data: record };
}

async function getApplicantById(id) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('applicants')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return { source: 'supabase', data };
      }
    } catch (error) {
      // fall through to in-memory fallback
    }
  }

  const record = inMemoryApplicants.get(id);
  return { source: 'memory', data: record || null };
}

async function updateApplicantById(id, updates) {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('applicants')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (!error && data) {
        return { source: 'supabase', data };
      }
    } catch (error) {
      // fall through to in-memory fallback
    }
  }

  const record = inMemoryApplicants.get(id);
  if (!record) {
    return { source: 'memory', data: null };
  }

  const updated = {
    ...record,
    ...updates,
    full_name: updates.fullName || record.full_name,
    mobile: updates.mobile || record.mobile,
    resume_url: updates.resumeUrl || record.resume_url,
  };
  inMemoryApplicants.set(id, updated);
  return { source: 'memory', data: updated };
}

module.exports = {
  serializeApplicant,
  findApplicantByEmail,
  createApplicant,
  getApplicantById,
  updateApplicantById,
};
