import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="mb-8">
          <Link to="/careers">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Careers
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-4">Refund & Cancellation Policy</h1>
          <p className="text-muted-foreground">Last updated: August 2026</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Application Processing Fee Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                W3 Software Solutions charges a non-refundable one-time Application Processing Fee of ₹49 for processing, verifying, and evaluating candidate applications for open roles.
              </p>
              <p>
                Payment of the application processing fee covers administrative costs associated with profile verification and evaluation. Payment does not guarantee interview selection, employment, job offer, or placement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Refund Eligibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Duplicate Charges & Technical Errors</h3>
                <p>
                  If a candidate experiences duplicate debits due to a payment gateway error or technical fault, the excess amount will be refunded upon verification. Candidates must submit proof of duplicate transactions to support@w3softwaresolutions.com within 7 days.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Voluntary Withdrawal or Non-Selection</h3>
                <p>
                  Once an application is submitted and processed, the fee is non-refundable regardless of candidate selection outcome, interview results, or voluntary application withdrawal.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>
                For any payment disputes or billing queries, please contact our support team at:
              </p>
              <p className="mt-2 font-medium text-foreground">
                Email: support@w3softwaresolutions.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
