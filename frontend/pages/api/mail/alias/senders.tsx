import { ApolloClient, InMemoryCache } from '@apollo/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ResolveSendersStudentIdDocument, ResolveSendersStudentIdQuery } from '~/generated/graphql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(404);
  }

  const mail = req.query.mail as string;

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
  });

  const { data } = await client.query<ResolveSendersStudentIdQuery>({
    query: ResolveSendersStudentIdDocument,
    variables: { alias: mail },
  });
  res.setHeader('Content-Type', 'text/plain');
  const senders = data.resolveSenders.map((r) => {
    const studentIds = r.emailUsers.map((u) => u.studentId)
      .filter((v, i, a) => a.indexOf(v) === i);
    return `${r.alias} ${studentIds.join(', ')}`;
  });
  const result = `${senders.join('\n')}
  `;
  return res.status(200).end(result);
}
