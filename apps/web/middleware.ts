import {NextRequest, NextResponse} from 'next/server';
import {getProfile} from "@src/core/cms/endpoints/profile";
import {ciEquals} from "@edge/utils";
import {appConfig} from "@src/config";

const config =  appConfig();

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname.split('/');

  if (path[1] === 'accounts') {
    const addressOrUsername = path[2];
    const profile = await findProfile(addressOrUsername);
    const matchesAddress = ciEquals(addressOrUsername, profile?.walletAddress);
    const matchesUsername = ciEquals(addressOrUsername, profile?.username);

    // Redirect if profile found and has a username that is not their specified address
    if (profile && matchesAddress && !matchesUsername) {
      // Redirect to the profile name URL if a profile exists
      path[2] = profile.username;
      const url = req.nextUrl.clone();
      url.pathname = path.join('/');
      url.search = req.nextUrl.search; // Preserve query strings
      return NextResponse.redirect(url);
    }
  }

  // Continue with the request if it's not a web3 address or no profile exists
  return NextResponse.next();
}

async function findProfile(address: string): Promise<any | null> {
  try {
    const user = await fetch(`${config.urls.cms}/profile?walletAddress=${address}`) ?? null;
    const data = await user.json();
    return data.data;
  } catch (error) {
    // user not found or server error
  }

  return null;
}
