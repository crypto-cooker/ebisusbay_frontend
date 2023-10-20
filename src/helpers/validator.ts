export const deepValidation = (prevProps: any, nextProps: any) => JSON.stringify(prevProps) === JSON.stringify(nextProps);

export const parseErrorMessage = (error: any, defaultError?: string) => {
  if (!error) return 'Unknown Error';

  if (error.name === 'AxiosError') {
    if (error.response?.data?.error?.metadata?.message) {
      return error.response.data.error.metadata.message;
    }
    if (error.response?.data?.error?.metadata?.metadata) {
      return error.response?.data.error.metadata.metadata;
    }
  }

  if (!!error.data) {
    return error.data.message;
  }

  // Contract errors
  if (error.error?.message) {
    try {
      const parts = error.error.message.split(':');
      return capitalizeFirstLetter(parts[parts.length - 1].trim());
    } catch (e: any) {
      console.log('Failed to parse error message', e, error.error.message);
    }
  }

  if (error.message) {
    return error.message;
  }

  return defaultError ?? 'Unknown Error';
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}