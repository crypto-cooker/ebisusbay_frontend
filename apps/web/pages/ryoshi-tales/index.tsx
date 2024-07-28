import { Heading, Text, Box, Image, Center, Link, useColorModeValue } from "@chakra-ui/react";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {hostedImage} from "@src/helpers/image";
import ImageService from "@src/core/services/image";


const ryoshiTalesInfo = [
  {
    title: 'Overview',
    info: [
      {
        type: 'text',
        data: 'Ryoshi Tales is a mobile resource management game, playable on Android and iOS, best played on a tablet device!'
      },
      {
        type: 'text',
        data: 'With a chibi/cartoon aesthetic, users get to build a Japanese civilization from its inception.'
      },
      {
        type: 'text',
        data: 'Players get to see their civilization evolve all the way from the prehistoric age to future eras while producing, trading, and battling against other players.'
      },
      {
        type: 'text',
        data: 'Ryoshi Tales boasts a large variety of tasks that can be undertaken based on resource gathering, building structures, and creating unique items and units.'
      },
    ],
    image: {
      src: hostedImage('/img/ryoshiTales/synopsis.png'),
      alt: 'synopsis'
    }
  },
  {
    title: 'Game Design',
    info: [
      {
        type: 'text',
        data: 'There are many characters that can be used throughout the game and, depending on their abilities, they can help in different areas and with different tasks. Also, users will be able to improve their characters’ stats in the different learning centers corresponding to each stat block.'
      }
    ],
    image: {
      src: hostedImage('/img/ryoshiTales/characters.png'),
      alt: 'characters'
    }
  },
  {
    title: 'World',
    info: [
      {
        type: 'text',
        data: 'The game takes place on Ebisu’s Islands. The evolution of the island is divided in AGES that, at the same time, are made up of several PERIODS.'
      },
      {
        type: 'text',
        data: 'In order to advance from one PERIOD to another, users need to meet certain building requisites and gather a certain amount of specific resources.'
      }
    ],
  },
  {
    image: {
      src: hostedImage('/img/ryoshiTales/world.png'),
      alt: 'world',
      description: 'The game counts with an isometric point of view, able to zoom the camera in or out to visualize specific buildings or characters in more detail.',
      direction: 'horizontal'
    }
  },
  {
    title: 'Gameplay',
    info: [
      {
        type: 'text',
        data: 'The design goal in Ryoshi Tales is to build a game experience that combines simplicity with depth and that can generate long-term loyalty in players.'
      },
      {
        type: 'text',
        data: 'The game and economy design will be a playable loop that contains two main instances: RESOURCE MANAGEMENT and COMBAT.'
      },
      {
        type: 'text',
        data: 'By integrating a competitive factor to the experience, the game promotes the players’  engagement.'
      },
      {
        type: 'text',
        data: 'The combat stage in Ryoshi Tales is a medium term goal within the experience: players will be  able to form an army and train their respective units.'
      },
      {
        type: 'text',
        data: 'The design of units, their appearance, equipment, and armaments constitute a new axis for monetization: skins, items, boosters, and unique objects that make up combat units.'
      }
    ],
      image: {
        src: hostedImage('/img/ryoshiTales/tokenLogo.svg'),
        alt: 'logo',
        direction: 'horizontal'
      },
 
  },
  {
    title: 'About the Token',
    info: [

      {
        type: 'text',
        data: 'The KOI token was created to promote Ryoshi Tales’ native economy. It will use Cronos’ blockchain.'
      },

    ],
    
  },
  
  {

    image: {
      src: hostedImage('/img/ryoshiTales/pieChart.svg'),
      alt: 'pie chart',
      direction: 'horizontal'
    }
  },
  {
    title: 'Limited supply',
    info: [
      {
        type: 'title',
        data: 'Deflationary behavior'
      },
      {
        type: 'text',
        data: 'Each time tokens are used to buy assets in game, they get burned.'
      },
      {
        type: 'title',
        data: 'KOI token has real utility within the Ryoshi Tales metaverse'
      },
      {
        type: 'text',
        data: 'KOI can be combined with in-game assets for Staking APRs, which will offer our community a way to accumulate additional $KOI.'
      },
      {
        type: 'text',
        data: 'We are happy to announce our good friends at Mad Meerkat Finance are hosting a launchpad for people to purchase KOI tokens.'
      },
      // {
      //   type: 'text',
      //   data: 'The launchpad release will take place on October 25th at 4 AM UTC, lasting 24 hours, so make sure to mark your calendars! '
      // },
    ]
  },
  /*{
    title: 'Want to know more?',
    info: [
      {
        type: 'link',
        url: '#',
        data: 'Download our pitch deck here'
      },
    ]

  }*/
]


const RyoshiTales = () => {
  const primaryColor = useColorModeValue('#218cff', '#91e1d9');

  return (
    <>
      <PageHead
        title='Ryoshi Tales'
        description='Ryoshi Tales is a mobile resource management game with a chibi/cartoon aesthetic in which we will have to build a Japanese civilization from its inception in the prehistoric age, evolving all the way through the futurist age while producing, trading, and battling against other players.'
        url='/ryoshi-tales'
        image={hostedImage('/img/ryoshiTales/preview.webp')}
      />
      <Center w='100%' height={300}>
        <Image src={ImageService.translate('img/ryoshiTales/banner.png').banner()} alt={'banner'} width='100%' height='100%' objectFit='cover'/>
      </Center>
      <div>
        <section className="gl-legacy container mt-0" >
          <Center>
            <Box
              as='iframe'
              src='https://cdn-prod.ebisusbay.biz/Ryoshi_Tales_edit.mp4'
              h={['200px', '240px','312px']}
              sx={{
                aspectRatio: '16/9'
              }}/>
          </Center>
        {

          ryoshiTalesInfo.map((section, i) => (
            
            <section key={i} style={{marginTop: (section.title)? '120px' : '0px'}} >
              
              <Center flexDirection={['column','column', (i%2 === 0?  'row' : 'row-reverse') ]}>
                {section.info && section.info.length > 0 && (
                <Center w={['100%', '100%', (section.image && section.image.src)? '50%' : '800px']} flexDirection='column' p='16px 20px'>
                  {section.title && (
                    <Heading as="h2" size="xl" textAlign={(section.image && section.image.src)? 'center': 'inherit'} mb='16px'>
                      {section.title}
                    </Heading>)}
                  {
                    section.info.map((value, j)=>{
                      switch( value.type ){
                        case 'title':
                          return (
                            <Heading key={j} textAlign='center' as="h2" size="md" mb='8px' mt='24px' color={primaryColor}>
                              {value.data}
                            </Heading>
                          );
                        case 'text':
                          return (
                            <Text key={j} textAlign='center' fontSize='xl' mb='16px' >
                              {value.data}
                            </Text>
                          )
                        case 'link':
                          return (
                            <Heading key={j} as="h2" size="md" mb='8px' mt='24px' color={primaryColor} textAlign='center'>
                              <Link color={primaryColor} href={''} style={{ textDecoration: 'underline' }} textAlign='center'>
                              {value.data}
                              </Link> 
                            </Heading>
                          );
                      }
                    })
                  }
                </Center>)}
                {section.image && section.image.src && (
                <Center  maxW={['100%', '100%', (section.info && section.info.length)? '50%' : '100%']} p={section.image.direction === 'horizontal'? ['0px', '16px 28px'] : '16px 28px'}>
                  <Image w={section.image.direction === 'horizontal'? ['340px', '600px', (section.info && section.info.length > 0)? '100%' : '600px'] : '100%'} maxH='484px' src={section.image.src} alt={section.image.alt} />
                </Center>)}
              </Center>
            </section>
          ))
        }

          <Center flexDirection='column' p='16px 20px'>
            <Text textAlign='center' fontSize='xl' mb='16px'>
              The <a href="https://mm.finance/launchpad" target="_blank" style={{color: primaryColor}} className="fw-bold">launchpad</a> release will take place on October 25th at 4 AM UTC, lasting 24 hours, so make sure to mark your calendars!
            </Text>
          </Center>

          <section style={{marginTop: '120px'}} >
            <Center flexDirection={['column','column', 'row']}>
              <Center w={['100%', '100%', '800px']} flexDirection='column' p='16px 20px'>
                <Heading as="h2" size="xl" textAlign='center' mb='16px'>
                  Want to know more?
                </Heading>
                <Heading as="h2" size="md" mb='8px' mt='24px' color={primaryColor} textAlign='center'>
                  <Link color={primaryColor} href="https://cdn-prod.ebisusbay.com/Ryoshi_Tales_Pitch_Deck.pdf" target="_blank" style={{ textDecoration: 'underline' }} textAlign='center'>
                    Download the pitch deck here
                  </Link>
                </Heading>
              </Center>
            </Center>
          </section>

        </section>
      </div>
    </>
  )
}

export default RyoshiTales;