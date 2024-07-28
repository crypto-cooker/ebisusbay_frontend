import {GetServerSidePropsContext} from "next";

function Health() {
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  context.res.end('healthy');
  return { props: { } }
}

export default Health;