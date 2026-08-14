import { CandidateOtpModal, CandidateOtpModalProps } from './CandidateOtpModal';

export function EmailAuthCard(props: Partial<CandidateOtpModalProps> & {
  email?: string;
  onEmailChange?: (val: string) => void;
  onContinue?: () => void;
  onBack?: () => void;
}) {
  return (
    <CandidateOtpModal
      open={true}
      onOpenChange={() => {}}
      initialEmail={props.email || ''}
      onSendOtp={props.onSendOtp || (async () => {})}
      onVerifyOtp={props.onVerifyOtp || (async () => {})}
      isLoading={props.isLoading}
      externalError={props.externalError}
    />
  );
}

export { CandidateOtpModal };
