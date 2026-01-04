import React from 'react';
import { FaceLivenessDetectorCore,AwsCredentialProvider } from '@aws-amplify/ui-react-liveness';
import { Loader, ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export function LivenessQuickStartReact() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [createLivenessApiData, setCreateLivenessApiData] = React.useState<{
    sessionId: string;
  } | null>(null);

const credentialProvider = async () => {
  return {}
};

  const fetchCreateLiveness = async () => {
    /*
     * This should be replaced with a real call to your own backend API
     */
    await new Promise((r) => setTimeout(r, 2000));
    const mockResponse = { sessionId: '58b9eb46-5a14-46a9-a89f-f94b84f36530' };
    const data = mockResponse;
    setCreateLivenessApiData(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchCreateLiveness();
  }, []);

  const handleAnalysisComplete: () => Promise<void> = async () => {
    /*
     * This should be replaced with a real call to your own backend API
     */
    const response = await fetch(
      `/api/get?sessionId=${createLivenessApiData.sessionId}`
    );
    const data = await response.json();

    /*
     * Note: The isLive flag is not returned from the GetFaceLivenessSession API
     * This should be returned from your backend based on the score that you
     * get in response. Based on the return value of your API you can determine what to render next.
     * Any next steps from an authorization perspective should happen in your backend and you should not rely
     * on this value for any auth related decisions.
     */
    if (data.isLive) {
      console.log('User is live');
    } else {
      console.log('User is not live');
    }
  };

  // Use a ref to track if we're currently handling an error
  const isHandlingError = React.useRef(false);

  const handleError = async (error) => {
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