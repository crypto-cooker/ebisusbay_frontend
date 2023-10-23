import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  if (req.method === 'POST') {
    const data: Array<{ [key: string]: any }> = req.body.data;
    const csv = convertToCSV(data); // The conversion function you have

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
    res.send(csv);
  } else {
    res.status(405).end(); // Method not allowed
  }
}

function sanitize(value: string): string {
  if (['=', '+', '-', '@'].includes(value.charAt(0))) {
    return `'${value}`;
  }
  return value;
}

function convertToCSV(objArray: Array<{ [key: string]: any }>): string {
  const array = objArray;
  let str = '';

  // headers
  const headers = Object.keys(array[0]);
  str += headers.join(',') + '\r\n';

  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (let index in array[i]) {
      if (line !== '') line += ',';

      // Handle values that contain comma or newline
      let value = sanitize((array[i][index] ?? '').toString());
      line += '"' + value.replace(/"/g, '""') + '"';
    }
    str += line + '\r\n';
  }
  return str;
}