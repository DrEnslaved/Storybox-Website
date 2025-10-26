const { createClient } = require('@sanity/client')
require('dotenv').config()

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'yhhlq588',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'sbxdataset',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function seedBlog() {
  console.log('🌱 Seeding Sanity blog...\n')

  try {
    // Create Author
    console.log('Creating author...')
    const author = await client.create({
      _type: 'author',
      name: 'Екип Storybox',
      slug: {
        _type: 'slug',
        current: 'ekip-storybox'
      },
      bio: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Професионален екип с над 10 години опит в машинната бродерия и текстилния печат. Специализираме се в корпоративни решения и персонализирани продукти.'
            }
          ]
        }
      ]
    })
    console.log('✅ Author created:', author.name)

    // Create Categories
    console.log('\nCreating categories...')
    const categoryEmbroidery = await client.create({
      _type: 'category',
      title: 'Бродерия',
      slug: {
        _type: 'slug',
        current: 'broderiya'
      },
      description: 'Всичко за машинната бродерия',
      color: '#10b981'
    })

    const categoryPrint = await client.create({
      _type: 'category',
      title: 'Печат',
      slug: {
        _type: 'slug',
        current: 'pechat'
      },
      description: 'Новини и съвети за текстилния печат',
      color: '#3b82f6'
    })

    const categoryBusiness = await client.create({
      _type: 'category',
      title: 'Бизнес',
      slug: {
        _type: 'slug',
        current: 'biznes'
      },
      description: 'Съвети за корпоративен брандинг',
      color: '#8b5cf6'
    })
    console.log('✅ Categories created')

    // Blog Post 1 - Featured
    console.log('\nCreating blog posts...')
    const post1 = await client.create({
      _type: 'post',
      title: 'Добре дошли в блога на Storybox!',
      slug: {
        _type: 'slug',
        current: 'dobre-doshli-v-bloga'
      },
      author: {
        _type: 'reference',
        _ref: author._id
      },
      categories: [
        {
          _type: 'reference',
          _ref: categoryEmbroidery._id
        }
      ],
      publishedAt: new Date().toISOString(),
      excerpt: 'Научете повече за машинната бродерия, текстилния печат и как можем да помогнем на вашия бизнес да се откроява.',
      body: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Добре дошли в официалния блог на Storybox - вашият партньор за машинна бродерия и текстилен печат в София!'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Какво правим?'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'В Storybox предлагаме професионални услуги за машинна бродерия и текстилен печат. С над 10 години опит в индустрията, ние помагаме на компании и частни клиенти да създадат уникални персонализирани продукти.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Нашите услуги включват:'
            }
          ]
        },
        {
          _type: 'block',
          listItem: 'bullet',
          children: [
            {
              _type: 'span',
              text: 'Машинна бродерия с високо качество'
            }
          ]
        },
        {
          _type: 'block',
          listItem: 'bullet',
          children: [
            {
              _type: 'span',
              text: 'Текстилен печат за промоционални материали'
            }
          ]
        },
        {
          _type: 'block',
          listItem: 'bullet',
          children: [
            {
              _type: 'span',
              text: 'Корпоративен брандинг'
            }
          ]
        },
        {
          _type: 'block',
          listItem: 'bullet',
          children: [
            {
              _type: 'span',
              text: 'Персонализирани подаръци'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Следете нашия блог за полезни съвети, новини от индустрията и вдъхновяващи проекти!'
            }
          ]
        }
      ],
      featured: true,
      seo: {
        metaTitle: 'Добре дошли в блога на Storybox',
        metaDescription: 'Научете повече за машинната бродерия и текстилния печат. Съвети, новини и проекти от Storybox.',
        keywords: ['бродерия', 'печат', 'текстил', 'корпоративен брандинг']
      }
    })
    console.log('✅ Post 1 created:', post1.title)

    // Blog Post 2
    const post2 = await client.create({
      _type: 'post',
      title: '5 Предимства на Машинната Бродерия за Вашия Бизнес',
      slug: {
        _type: 'slug',
        current: '5-predimstva-na-broderiata'
      },
      author: {
        _type: 'reference',
        _ref: author._id
      },
      categories: [
        {
          _type: 'reference',
          _ref: categoryEmbroidery._id
        },
        {
          _type: 'reference',
          _ref: categoryBusiness._id
        }
      ],
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      excerpt: 'Открийте защо машинната бродерия е перфектният избор за корпоративни униформи и промоционални продукти.',
      body: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Когато става въпрос за брандиране на текстил, машинната бродерия предлага множество предимства пред други методи.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: '1. Дълготрайност'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Бродерията издържа на многократни изпирания и запазва цветовете си години наред. Това я прави идеална за корпоративни униформи и работно облекло.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: '2. Професионален Външен Вид'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Релефната текстура на бродерията придава елегантен и луксозен вид на всеки продукт. Това повишава възприемането на вашата марка.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: '3. Възможност за Детайли'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Съвременните машини позволяват изключително детайлни дизайни, включително малки текстове и сложни логa.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: '4. Подходяща за Всякакви Материали'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Бродерията работи отлично на памук, полиестер, кожа, шапки, чанти и много други материали.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: '5. Висока Възвръщаемост на Инвестицията'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Благодарение на дълготрайността и професионалния вид, продуктите с бродерия често се използват по-дълго време, което означава повече експозиция за вашата марка.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'blockquote',
          children: [
            {
              _type: 'span',
              text: 'Инвестицията в качествена бродерия се отплаща многократно през годините.'
            }
          ]
        }
      ],
      featured: false,
      seo: {
        metaTitle: '5 Предимства на Машинната Бродерия | Storybox',
        metaDescription: 'Открийте защо машинната бродерия е най-добрият избор за корпоративно брандиране и промоционални продукти.',
        keywords: ['машинна бродерия', 'корпоративни униформи', 'брандиране']
      }
    })
    console.log('✅ Post 2 created:', post2.title)

    // Blog Post 3
    const post3 = await client.create({
      _type: 'post',
      title: 'Как да Изберете Правилния Печат за Вашите Промоционални Продукти',
      slug: {
        _type: 'slug',
        current: 'izbor-na-pravilnia-pechat'
      },
      author: {
        _type: 'reference',
        _ref: author._id
      },
      categories: [
        {
          _type: 'reference',
          _ref: categoryPrint._id
        },
        {
          _type: 'reference',
          _ref: categoryBusiness._id
        }
      ],
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      excerpt: 'Сравнение между различните методи за текстилен печат и как да изберете най-подходящия за вашите нужди.',
      body: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Изборът на правилния метод за печат може да направи голяма разлика в качеството и цената на вашите промоционални продукти.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'DTG (Direct-to-Garment) Печат'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: span',
              text: 'Идеален за малки количества и детайлни, многоцветни дизайни. Отлично качество на отпечатък, особено за фотореалистични изображения.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              marks: ['strong'],
              text: 'Най-подходящ за: '
            },
            {
              _type: 'span',
              text: 'Малки поръчки (1-50 бройки), сложни дизайни'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Трансферен Печат'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Бърз и ефективен метод, подходящ за средни количества. Отличен за спортни екипи и корпоративни събития.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              marks: ['strong'],
              text: 'Най-подходящ за: '
            },
            {
              _type: 'span',
              text: 'Средни поръчки (50-500 бройки), спортно облекло'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Сублимационен Печат'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Перфектен за полиестерни тъкани и предмети като чаши. Цветовете проникват в материала за невероятна дълготрайност.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              marks: ['strong'],
              text: 'Най-подходящ за: '
            },
            {
              _type: 'span',
              text: 'Спортни екипи, всички видове промоционални подаръци'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Как да Изберете?'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Вземете предвид: количество на поръчката, сложност на дизайна, вид на материала, бюджет и крайна употреба на продукта. Нашият екип винаги е готов да ви консултира!'
            }
          ]
        }
      ],
      featured: false,
      seo: {
        metaTitle: 'Как да Изберете Правилния Текстилен Печат | Storybox',
        metaDescription: 'Сравнете различните методи за текстилен печат - DTG, трансферен, сублимация и повече.',
        keywords: ['текстилен печат', 'DTG печат', 'промоционални продукти']
      }
    })
    console.log('✅ Post 3 created:', post3.title)

    // Blog Post 4
    const post4 = await client.create({
      _type: 'post',
      title: 'Тенденции в Корпоративното Брандиране за 2025',
      slug: {
        _type: 'slug',
        current: 'tendentsii-korporativno-brandirane-2025'
      },
      author: {
        _type: 'reference',
        _ref: author._id
      },
      categories: [
        {
          _type: 'reference',
          _ref: categoryBusiness._id
        }
      ],
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      excerpt: 'Открийте най-новите тенденции в корпоративното брандиране и как да направите вашата марка да се откроява.',
      body: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: '2025 година носи интересни промени в начина, по който компаниите представят своята идентичност.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: '1. Устойчивост и Еко Материали'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Все повече компании избират органични памуци и рециклирани материали за своите корпоративни продукти. Това не само помага на околната среда, но и подобрява имиджа на марката.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: '2. Минималистичен Дизайн'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'По-малко е повече - чисти линии, малки лога и елегантни шрифтове доминират корпоративния стил през 2025.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: '3. Персонализация'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Добавяне на имена на служители, индивидуални послания или специални елементи прави корпоративните подаръци по-ценени.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: '4. Функционалност'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Практичните продукти като водоустойчиви якета, качествени раници и технологични аксесоари са предпочитани пред декоративните елементи.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: '5. Дигитално Интегриране'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'QR кодове и NFC тагове на облеклото, които водят до дигитален контент, стават все по-популярни.'
            }
          ]
        }
      ],
      featured: true,
      seo: {
        metaTitle: 'Тенденции в Корпоративното Брандиране 2025 | Storybox',
        metaDescription: 'Открийте новите тенденции в корпоративното брандиране - устойчивост, минимализъм и персонализация.',
        keywords: ['корпоративно брандиране', 'тенденции 2025', 'бизнес подаръци']
      }
    })
    console.log('✅ Post 4 created:', post4.title)

    // Blog Post 5
    const post5 = await client.create({
      _type: 'post',
      title: 'Стъпка по Стъпка: Как Работи Процесът на Бродерия',
      slug: {
        _type: 'slug',
        current: 'proces-na-broderiya'
      },
      author: {
        _type: 'reference',
        _ref: author._id
      },
      categories: [
        {
          _type: 'reference',
          _ref: categoryEmbroidery._id
        }
      ],
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      excerpt: 'Разберете как вашият дизайн се превръща в красива бродерия - от идеята до готовия продукт.',
      body: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Много клиенти се питат как точно работи машинната бродерия. Нека ви разкажем за целия процес!'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Стъпка 1: Дигитализация на Дизайна'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Вашето лого или дизайн се преобразува в специален файлов формат, който машината може да чете. Това включва определяне на типа бодове, посоката и плътността на шевовете.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Стъпка 2: Избор на Нишки и Цветове'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Използваме висококачествени полиестерни нишки с устойчивост на избеляване. Можем да подберем цветовете точно според вашата корпоративна идентичност.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Стъпка 3: Подготовка на Материала'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Текстилът се стабилизира със специален подплат, който предотвратява набръчкване и осигурява гладка повърхност.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Стъпка 4: Бродиране'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Машината автоматично изработва дизайна с прецизност до милиметър. За средно лого това отнема около 10-15 минути.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Стъпка 5: Довършителни Работи'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'След бродирането, излишните нишки се отстраняват и продуктът се проверява внимателно за качество.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Резултат'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Получавате професионално избродиран продукт, който издържа години и представя марката ви по най-добрия начин!'
            }
          ]
        }
      ],
      featured: false,
      seo: {
        metaTitle: 'Как Работи Процесът на Машинна Бродерия | Storybox',
        metaDescription: 'Научете как вашият дизайн се превръща в красива бродерия - стъпка по стъпка обяснение на процеса.',
        keywords: ['процес на бродерия', 'машинна бродерия', 'дигитализация']
      }
    })
    console.log('✅ Post 5 created:', post5.title)

    console.log('\n🎉 Blog seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log('- 1 Author created')
    console.log('- 3 Categories created')
    console.log('- 5 Blog posts created (2 featured)')
    console.log('\n✨ Visit http://localhost:3000/blog to see your new blog posts!')

  } catch (error) {
    console.error('\n❌ Error seeding blog:', error)
    process.exit(1)
  }
}

seedBlog()
