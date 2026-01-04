import React from 'react';
import { FaceLivenessDetectorCore } from '@aws-amplify/ui-react-liveness';
import { Loader, ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export function LivenessQuickStartReact() {
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchCreateLiveness = async () => {
    /*
     * This should be replaced with a real call to your own backend API
     */
    await new Promise((r) => setTimeout(r, 2000));
    // setCreateLivenessApiData(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchCreateLiveness();
  }, []);

  const handleAnalysisComplete: () => Promise<void> = async () => {
    /*
     * This should be replaced with a real call to your own backend API
     */

      console.log('User is not live');
  };

  // Use a ref to track if we're currently handling an error
  const isHandlingError = React.useRef(false);

  const handleError = async (error: any) => {
    console.error('Liveness error:', error);

    // Simple infinite loop prevention
    if (isHandlingError.current) return;
    isHandlingError.current = true;
    setLoading(true);

    // Create a new session for retry - sessions are single-use
    await fetchCreateLiveness();

    // Reset error handling flag
    isHandlingError.current = false;
  };

  return (
    <ThemeProvider>
      {loading ? (
        <Loader />
      ) : (
            <FaceLivenessDetectorCore
              sessionId={"-"}
              region="us-east-1"
              config={{
              credentialProvider: async () => ({
                accessKeyId: '-',
                secretAccessKey: '-',
                sessionToken: '-', // 如果使用临时凭证（如 Cognito）
              }) 
              }}
              onAnalysisComplete={handleAnalysisComplete}
              onError={handleError}
            />
      )}
    </ThemeProvider>
  );
}