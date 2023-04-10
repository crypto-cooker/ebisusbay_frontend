import Navbar from './navbar'
import Footer from "./footer";
import React, {ReactNode, useEffect} from "react";
import {Box, Grid, GridItem} from "@chakra-ui/react";
import {useLoadingProgress} from "./loader";
import {Router} from "next/router";

export default function Layout({ children }: { children: ReactNode }) {
  // 1. useLoadingProgress hook
  const { start, done } = useLoadingProgress()

  // 2. onRouterChangeStart
  const onRouteChangeStart = () => {
    start()
  }

  // 3. onRouterChangeComplete
  const onRouteChangeComplete = () => {
    setTimeout(() => {
      done()
    }, 1)
  }

  // 4. Subscribe to router events
  useEffect(() => {
    Router.events.on('routeChangeStart', onRouteChangeStart)
    Router.events.on('routeChangeComplete', onRouteChangeComplete)
    Router.events.on('routeChangeError', onRouteChangeComplete)

    return () => {
      Router.events.off('routeChangeStart', onRouteChangeStart)
      Router.events.off('routeChangeComplete', onRouteChangeComplete)
      Router.events.off('routeChangeError', onRouteChangeComplete)
    }
  }, [])

  return (
    <>
      <Grid templateRows="74px 1fr auto">
        <GridItem>
          <Navbar />
        </GridItem>
        <GridItem minH='calc(100vh - 592px - 74px)'>
          <Box as='main' h='full'>{children}</Box>
        </GridItem>
        <GridItem>
          <Footer />
        </GridItem>
      </Grid>
    </>
  )
}