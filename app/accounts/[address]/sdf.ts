import {NextRequest, NextResponse} from 'next/server';
import {getProfile} from "@src/core/cms/endpoints/profile";
import {ciEquals} from "@src/utils";

export async function middleware(req: NextRequest) {

  const addressOrUsername = req.nextUrl.pathname.split('/')[3];
  const profile = await findProfile(addressOrUsername);
  const matchesAddress = ciEquals(addressOrUsername, profile?.walletAddress);
  const matchesUsername = ciEquals(addressOrUsername, profile?.username);

  // Redirect if profile found and has a username that is not their specified address
  if (profile && matchesAddress && !matchesUsername) {
    // Redirect to the profile name URL if a profile exists
    const url = req.nextUrl.clone();
    url.pathname = `/accounts/${profile.username}`;
    url.search = req.nextUrl.search; // Preserve query strings
    return NextResponse.redirect(url);
  }

  // Continue with the request if it's not a web3 address or no profile exists
  return NextResponse.next();
}

async function findProfile(address: string): Promise<any | null> {
  try {
    const user = await getProfile(address) ?? null;
    return user?.data;
  } catch (error) {
    // user not found or server error
  }

  return null;
}
