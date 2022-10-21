import Footer from '../../src/Components/components/Footer';
import { Heading, Text, Flex, Box, Image, Center, AspectRatio } from "@chakra-ui/react";
import PageHead from '@src/Components/Head/PageHead';


const ryoshiTalesInfo = [
  {
    title: 'Synopsis',
    info: [
      {
        type: 'text',
        data: 'Ryoshi Tales is a mobile resource management game with a chibi/cartoon aesthetic in which we will have to build a Japanese civilization from its inception in the prehistoric age, evolving all the way through the futurist age while producing, trading, and battling against other players. As a main characteristic, Ryoshi Tales boasts a large variety of tasks that can be undertaken based on resource gathering, that allows players to organize and manipulate the cycles of their city to their liking, while building structures, and creating unique items and units.'
      },
      {
        type: 'title',
        data: 'Platforms'
      },
      {
        type: 'text',
        data: 'The main target platforms for Ryoshi Tales are Android and iOS. From inception, game design is aimed towards compatibility with tablet formats.'
      }
    ],
    image: {
      src: './img/ryoshiTales/synopsis.png',
      alt: 'synopsis'
    }
  },
  {
    title: 'Characters',
    info: [
      {
        type: 'text',
        data: 'There are many characters that we can create and administer throughout the game. Depending on their abilities they can help in different areas and with different tasks. They can better their stats in the different learning centers corresponding to each stat block.'
      }
    ],
    image: {
      src: './img/ryoshiTales/characters.png',
      alt: 'characters'
    }
  },
  {
    title: 'World',
    info: [
      {
        type: 'text',
        data: 'The evolution of the island is divided in AGES that, at the same time, are made up of several PERIODS. In order to advance from one PERIOD to another, we need to meet certain building requisites and gather a certain amount of specific resources.'
      }
    ],
  },
  {
    image: {
      src: './img/ryoshiTales/world.png',
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
        data: 'Taking into account that the design goal in Ryoshi Tales is to build and a game experience that combines simplicity with depth and that can generate long-term loyalty in players, the proposal of game and economy design aim to be a playable loop that contains two main instances: RESOURCE MANAGEMENT and COMBAT.'
      },
      {
        type: 'text',
        data: 'Secondly, it integrates a competitive factor to the experience, which is one of the fundamental elements in making a game promote engagement.'
      },
      {
        type: 'text',
        data: 'Thirdly, adding a combat stage to Ryoshi Tales constitutes a new medium term goal within the experience: the formation of an army and the training of its respective units.'
      },
      {
        type: 'text',
        data: 'Lastly, the design of units, their appearance, equipment, and armaments constitute a new axis for monetization: skins, items, boosters, and unique objects that make up combat units.'
      }
    ],
 
  },
  {
    title: 'Game Mechanics',
    info: [
      {
        type: 'text',
        data: 'Gameplay structure will be supported by the three primordial needs: survival, existence, and evolution in order to generate a product of grand engagement capable of generating loyalty in its audience, in combination with the three pillars mentioned in the design goals: expression, socialization, and learning. These are integrated into a system of intrinsic and extrinsic motivations that seek to call the attention of players due to playability and aesthetic attractiveness, and manage to keep them playing thanks to external motivations.'
      },
      {
        type: 'title',
        data: 'PLAYABLE LOOP'
      },
      {
        type: 'text',
        data: 'The playable core of Ryoshi Tales is made up of two (2) main moments/mechanics of the game: resource management and combat. There’s always some task to perform. To achieve this we’ll use all the elements of the loop: Collection > Production/Creation > Sale > Combat.'
      },
      {
        type: 'title',
        data: 'RESOURCE MANAGEMENT'
      },
      {
        type: 'text',
        data: 'Resource management is the first main experience of the game, and consists of three stages: collection, creation, and commerce.'
      },
      {
        type: 'title',
        data: 'GATHERING'
      },
      {
        type: 'text',
        data: 'Availability of resources is defined based on the era in which the civilization our island belongs to is in. As we evolve and gain knowledge, new resources become available. The process of extraction and gathering of all resources will be manual at the beginning of the game, and as we evolve, they can become automated. To begin with we will assign a basic unit to collection. We can upgrade the speed of gathering of our units, as well as all other stats. Further on we’ll be able to build structures that produce resources independently.'
      },
    ],

  },
  {
    title: 'Tokenomics',
    info: [
      {
        type: 'title',
        data: 'About the Token'
      },
      {
        type: 'text',
        data: 'The KOI token was created to promote Ryoshi Tales native economy. It will use Cronos’ blockchain. It is mainly used as a game token.'
      },
      {
        type: 'title',
        data: 'How does it work?'
      },
      {
        type: 'text',
        data: 'It’s most popular use is for creating and developing an island and its civilization. KOI tokens will be able for purchase during some exchanges or can be earned within the game, and can be used to buy and exchange assets inside the game.'
      },
      {
        type: 'title',
        data: 'Stacking APR'
      },
      {
        type: 'text',
        data: 'KOI tokens can also be used for stacking APR, offering guaranteed return and a predictable source of income.'
      },
      {
        type: 'text',
        data: 'We aim for a coin that will work well within Ebisusbay environment as well as outside of the game.'
      }
    ],
    image: {
      src: './img/ryoshiTales/tokenLogo.svg',
      alt: 'logo',
      direction: 'horizontal'
    },
    
  },
  {
    info: [
      {
        type: 'text',
        data: 'There will be a maximum KOI token supply limit. Its behaviour will be deflationary, which will promote it’s increase in value. Each time tokens are used to buy assets ingame, they get burned, meaning that supply decreases. Total token supply is directly linked to game usage. KOI token has real utility whithin the Ryoshi Tales metaverse, but it also has criptocurrency market value and will be used in some decentralized exchanges.'
      }
    ]
  },
  {

    image: {
      src: './img/ryoshiTales/pieChart.svg',
      alt: 'pie chart',
      direction: 'horizontal'
    }
  },

]


const RyoshiTales = () => {

  return (
    <>
      <PageHead
        title='Ryoshi Tales'
        description='Ryoshi Tales is a mobile resource management game with a chibi/cartoon aesthetic in which we will have to build a Japanese civilization from its inception in the prehistoric age, evolving all the way through the futurist age while producing, trading, and battling against other players.'
        url='/ryoshi-tales'
      />
      <div>
        <Center w='100%' height='300px' bg='linear-gradient(to right, #F4F6E7 , #AED1CB)'>
          <Image src={'./img/ryoshiTales/logoColor.svg'} alt={'logo'} width='240px'/>
        </Center>

        <section className="gl-legacy container mt-0" >
          <Center>
            <Box
              as='iframe'
              src='https://cdn.ebisusbay.biz/Ryoshi_Tales_edit.mp4'
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
                <Center w={['100%', '100%', (section.image && section.image.src)? '50%' : '100%']} flexDirection='column' p='16px 20px'>
                  {section.title && (
                    <Heading as="h2" size="xl" align='center' mb='16px'>
                      {section.title}
                    </Heading>)}
                  {
                    section.info.map((value, j)=>{
                      switch( value.type ){
                        case 'title':
                          return (
                            <Heading key={j} as="h2" size="sm" mb='8px' mt='24px' color='#91e1d9'>
                              {value.data}
                            </Heading>
                          );
                        case 'text':
                          return (
                            <Text key={j} textAlign='justify' fontSize='xl' mb='16px'>
                              {value.data}
                            </Text>
                          )
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
        </section>
        <Footer />
      </div>
    </>
  )
}

export default RyoshiTales;