import { useMemo, useState } from 'react';
import { BadgeCheck, ChevronLeft, ChevronRight, FileText, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ApplicantFormData } from '@/components/careers/shared/types';

type ApplicationWizardProps = {
  onSubmit: (data: ApplicantFormData) => void;
  initialData?: ApplicantFormData;
};

const initialFormState: ApplicantFormData = {
  fullName: '',
  email: '',
  mobile: '',
  dateOfBirth: '',
  gender: '',
  country: '',
  state: '',
  city: '',
  postalCode: '',
  address: '',
  qualification: '',
  college: '',
  university: '',
  percentage: '',
  passingYear: '',
  experience: '',
  skills: '',
  portfolio: '',
  linkedIn: '',
  declarationAccepted: false,
};

const steps = [
  { title: 'Personal', description: 'Tell us about you' },
  { title: 'Address', description: 'Where you live' },
  { title: 'Education', description: 'Academic background' },
  { title: 'Professional', description: 'Work and skills' },
  { title: 'Declaration', description: 'Confirm your details' },
];

export function ApplicationWizard({ onSubmit, initialData }: ApplicationWizardProps) {
  const [formData, setFormData] = useState<ApplicantFormData>({ ...initialFormState, ...initialData });
  const [activeStep, setActiveStep] = useState(0);

  const progress = useMemo(() => ((activeStep + 1) / steps.length) * 100, [activeStep]);

  const updateField = (field: keyof ApplicantFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Card className="border-slate-200 bg-white/90 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)]">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-2xl font-semibold text-slate-900">Application form</CardTitle>
            <CardDescription className="mt-2 text-sm text-slate-600">
              {steps[activeStep].description}
            </CardDescription>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
            Step {activeStep + 1} of {steps.length}
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex flex-wrap gap-2">
          {steps.map((step, index) => (
            <BadgeCheck key={step.title} className={`h-4 w-4 ${index <= activeStep ? 'text-slate-900' : 'text-slate-300'}`} />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {activeStep === 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Full name</label>
              <Input value={formData.fullName} onChange={(event) => updateField('fullName', event.target.value)} placeholder="Aarav Sharma" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <Input type="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} placeholder="aarav@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Mobile</label>
              <Input value={formData.mobile} onChange={(event) => updateField('mobile', event.target.value)} placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Date of birth</label>
              <Input type="date" value={formData.dateOfBirth} onChange={(event) => updateField('dateOfBirth', event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Gender</label>
              <Input value={formData.gender} onChange={(event) => updateField('gender', event.target.value)} placeholder="Male / Female / Other" />
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Country</label>
              <Input value={formData.country} onChange={(event) => updateField('country', event.target.value)} placeholder="India" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">State</label>
              <Input value={formData.state} onChange={(event) => updateField('state', event.target.value)} placeholder="Rajasthan" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">City</label>
              <Input value={formData.city} onChange={(event) => updateField('city', event.target.value)} placeholder="Jaipur" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Postal code</label>
              <Input value={formData.postalCode} onChange={(event) => updateField('postalCode', event.target.value)} placeholder="302001" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Full address</label>
              <Textarea value={formData.address} onChange={(event) => updateField('address', event.target.value)} placeholder="Street, area, landmark" className="min-h-24" />
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Qualification</label>
              <Input value={formData.qualification} onChange={(event) => updateField('qualification', event.target.value)} placeholder="B.Tech / MCA" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">College</label>
              <Input value={formData.college} onChange={(event) => updateField('college', event.target.value)} placeholder="ABC College" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">University</label>
              <Input value={formData.university} onChange={(event) => updateField('university', event.target.value)} placeholder="University Name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Percentage / CGPA</label>
              <Input value={formData.percentage} onChange={(event) => updateField('percentage', event.target.value)} placeholder="88%" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Passing year</label>
              <Input value={formData.passingYear} onChange={(event) => updateField('passingYear', event.target.value)} placeholder="2024" />
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Experience</label>
              <Input value={formData.experience} onChange={(event) => updateField('experience', event.target.value)} placeholder="2 years" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Skills</label>
              <Input value={formData.skills} onChange={(event) => updateField('skills', event.target.value)} placeholder="React, Node.js, TypeScript" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Resume upload</label>
              <div className="flex items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white p-2 text-slate-700 shadow-sm">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Upload resume</p>
                    <p className="text-sm text-slate-500">PDF, DOCX, or TXT (UI preview only)</p>
                  </div>
                </div>
                <Button type="button" variant="outline" className="rounded-2xl">Choose file</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Portfolio</label>
              <Input value={formData.portfolio} onChange={(event) => updateField('portfolio', event.target.value)} placeholder="https://portfolio.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">LinkedIn</label>
              <Input value={formData.linkedIn} onChange={(event) => updateField('linkedIn', event.target.value)} placeholder="https://linkedin.com/in/you" />
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <FileText className="mt-0.5 h-5 w-5 text-emerald-700" />
              <div>
                <p className="font-semibold text-emerald-900">Declaration</p>
                <p className="text-sm text-emerald-700">Please confirm that everything you have entered is accurate and current.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <Checkbox checked={formData.declarationAccepted} onCheckedChange={(checked) => updateField('declarationAccepted', Boolean(checked))} />
              <label className="text-sm leading-6 text-slate-600">
                I certify that the information provided is correct and I agree to the verification process.
              </label>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button type="button" variant="outline" onClick={prevStep} className="rounded-2xl" disabled={activeStep === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button type="button" onClick={nextStep} className="rounded-2xl">
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} className="rounded-2xl" disabled={!formData.declarationAccepted}>
              Submit application
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
