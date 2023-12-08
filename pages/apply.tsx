import React, {useEffect, useState} from 'react';
import styled, {createGlobalStyle} from 'styled-components';
import Reveal from 'react-awesome-reveal';
import {keyframes} from '@emotion/react';
import dynamic from 'next/dynamic';
import {faLightbulb, faTags} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useRouter} from "next/router";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {Heading} from "@chakra-ui/react";
import {GetServerSidePropsContext} from "next";
import {useAppSelector} from "@src/Store/hooks";

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;

const GlobalStyles = createGlobalStyle`
  .feature-box.f-boxed.active {
    background: #145499;
    color: #fff;
    box-shadow: 2px 2px 20px 0px rgba(0, 0, 0, 0.05);
    transition: 0.7s;
  }
  .feature-box.f-boxed.active h4 {
    color: #fff;
    transition: 0.7s;
  }
  
  .feature-box.f-boxed:hover {
    background: #145499;
  }
`;

const ChoiceBox = styled.div`
  @media only screen and (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 400px;
  }

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 250px;
    padding: 30px !important;
  }
`;

const StyledForm = styled.div`
  .nf-form-container * {
    color: ${({ theme }) => theme.colors.textColor3} !important;
    background: ${({ theme }) => theme.colors.bgColor1} !important;
  }
  .nf-form-container input {
    color: ${({ theme }) => theme.colors.textColor3} !important;
    -webkit-text-fill-color: ${({ theme }) => theme.colors.textColor3} !important;
  }
  .nf-form-container .nf-files-upload {
    fill: ${({ theme }) => theme.colors.textColor3} !important;
  }

  .nf-root *,
  .nf-status-container * {
    color: ${({ theme }) => theme.colors.textColor3} !important;
    background: ${({ theme }) => theme.colors.bgColor1} !important;
  }
`;

const choice = {
  listing: 'listing',
  launchpad: 'launchpad'
};

const Application = ({type}: { type: string }) => {
  const router = useRouter();

  const [openTab, setOpenTab] = useState(type);
  const handleBtnClick = (index: string) => (element: any) => {
    if (choice[index as keyof typeof choice]) {
      router.push({
        pathname: '/apply',
        query: { type: choice[index as keyof typeof choice] }
      },
        undefined, { shallow: true }
      );
    }
  };

  useEffect(() => {
    if (router.query.type && choice[router.query.type as keyof typeof choice]) {
      setOpenTab(router.query.type as string);
      const element = document.getElementById('form');
      element?.scrollIntoView();
    }
  }, [router.query])

  return (
    <div>
      {type === choice.listing ? (
        <PageHead
          title="Listing Application"
          description="Get your project listed on Ebisu's Bay Marketplace"
          url="/apply?type=listing"
        />
      ) : type === choice.launchpad ? (
        <PageHead
          title="Launchpad Application"
          description="Get your project launched on Ebisu's Bay Launchpad"
          url="/apply?type=launchpad"
        />
      ) : (
        <PageHead
          title="Listing & Launchpad Application"
          description="Get your project to market on Ebisu's Bay Marketplace"
          url="/apply"
        />
      )}
      <GlobalStyles />
      <section className="gl-legacy container mt-0 mt-lg-5">
        <div className="row">
          <div className="col">
            <Heading>Choose Application Type</Heading>
          </div>
        </div>
        <div className="row justify-content-center mt-2">
          <div className="col-xl-4 col-sm-6 d-flex justify-content-center mb-2 mb-sm-0">
            <ChoiceBox
              className={`tab feature-box f-boxed style-3 ${openTab === choice.listing ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={handleBtnClick(choice.listing)}
            >
              <Reveal className="onStep mb-3" keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
                <FontAwesomeIcon className="bg-color-2" icon={faTags} />
              </Reveal>
              <div className="text">
                <Reveal className="onStep" keyframes={fadeInUp} delay={100} duration={600} triggerOnce>
                  <Heading as="h4" size="md">Listing Request</Heading>
                </Reveal>
                <Reveal className="onStep" keyframes={fadeInUp} delay={200} duration={600} triggerOnce>
                  <p className="">For established projects that would like to be added to the marketplace.</p>
                </Reveal>
              </div>
            </ChoiceBox>
          </div>

          <div className="col-xl-4 col-sm-6 d-flex justify-content-center">
            <ChoiceBox
              className={`tab feature-box f-boxed style-3 ${openTab === choice.launchpad ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={handleBtnClick(choice.launchpad)}
            >
              <Reveal className="onStep mb-3" keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
                <FontAwesomeIcon className="bg-color-2" icon={faLightbulb} />
              </Reveal>
              <div className="text">
                <Reveal className="onStep" keyframes={fadeInUp} delay={100} duration={600} triggerOnce>
                  <Heading as="h4" size="md">Launchpad Request</Heading>
                </Reveal>
                <Reveal className="onStep" keyframes={fadeInUp} delay={200} duration={600} triggerOnce>
                  <p className="">For projects that would like to launch on the Ebisu's Bay launchpad</p>
                </Reveal>
              </div>
            </ChoiceBox>
          </div>
        </div>
        <div id="form" className="row">
          <div className="col">
            <div className="col-lg-12 mt-4">
              {openTab === choice.listing && (
                <>
                  <Heading as="h3" size="md" className="text-center">Listing Request</Heading>
                  <iframe
                    height="1660px"
                    src="https://noteforms.com/forms/listing-requests-silnni"
                    style={{width: '100%', border:'none'}}
                  >
                  </iframe>
                </>
              )}
              {openTab === choice.launchpad && (
                <>
                  <Heading as="h3" size="md" className="text-center">Launchpad Request</Heading>
                  <iframe
                    height="1660px"
                    src="https://noteforms.com/forms/launchpad-applications-orrort"
                    style={{width: '100%', border:'none'}}
                  >
                  </iframe>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Application;

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  return {
    props: {
      type: query?.type ?? null,
    },
  };
};
