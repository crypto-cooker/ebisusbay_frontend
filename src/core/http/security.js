export const appendSecurityHeaders = (axiosConfig) => {
  if (process.env.EB_API_KEY) {
    axiosConfig.headers = {'eb-api-key': process.env.EB_API_KEY}
  }

  return axiosConfig;
}