import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

const ProcessingStatus = ({
  processingState,
  processingResult,
  onViewVideo,
  onUploadAnother,
  onTryAgain,
}) => {
  const isProcessing =
    processingState &&
    processingState !== "complete" &&
    processingState !== "error";

  return (
    <div>
      <PageHeader title="Upload Video" description="Processing your video" />
      <Card className="mx-auto max-w-lg">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          {isProcessing && (
            <>
              <div className="flex items-center gap-2 text-sm font-medium capitalize">
                Stage: {processingState.stage}
              </div>
              <Progress value={processingState.progress} className="w-full">
                <ProgressLabel>Processing</ProgressLabel>
                <ProgressValue />
              </Progress>
              <p className="text-xs text-muted-foreground">
                Please wait while your video is being processed...
              </p>
            </>
          )}

          {processingState === "complete" && processingResult && (
            <>
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="text-lg font-semibold">Processing Complete</p>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {processingResult.processingStatus}
                </Badge>
                <Badge variant="outline">
                  {processingResult.sensitivityStatus}
                </Badge>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={onViewVideo}>View Video</Button>
                <Button variant="outline" onClick={onUploadAnother}>
                  Upload Another
                </Button>
              </div>
            </>
          )}

          {processingState === "error" && (
            <>
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="text-lg font-semibold">Processing Failed</p>
              <p className="text-sm text-muted-foreground">
                Something went wrong while processing your video.
              </p>
              <Button variant="outline" onClick={onTryAgain}>
                Try Again
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingStatus;
