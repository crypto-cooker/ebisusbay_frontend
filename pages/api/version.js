export default async function handler(req, res) {
  res.end(process.env.VERSION)
}