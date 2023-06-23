export const deepValidation = (prevProps: any, nextProps: any) => JSON.stringify(prevProps) === JSON.stringify(nextProps);

export const parseErrorMessage = (error: any) => {
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

  if (error.message) {
    return error.message;
  }

  return 'Unknown Error';
}