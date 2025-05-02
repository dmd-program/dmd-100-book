import { defineConfig } from 'vitepress'
// Import the footnote plugin
import footnote from 'markdown-it-footnote'

// Extremely simple script that runs immediately
const scriptContent = `
  // Function runs as soon as the script is parsed
  (function() {
    // Get the embed parameter directly
    const params = new URLSearchParams(window.location.search);
    const embedParam = params.get('embed');
    
    // If embed=true, add the class immediately
    if (embedParam === 'true') {
      document.documentElement.classList.add('is-embedded');
    }
    
    // Handle navigation changes through mutation observer
    const observer = new MutationObserver(function(mutations) {
      const params = new URLSearchParams(window.location.search);
      const embedParam = params.get('embed');
      
      if (embedParam === 'true') {
        document.documentElement.classList.add('is-embedded');
      } else {
        document.documentElement.classList.remove('is-embedded');
      }
    });
    
    // Start observing once DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    } else {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  })();
`;

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "DMD 100",
  description: "Digital Multimedia Design 100 Course Content",
  
  // Add base configuration for GitHub Pages
  base: '/dmd-100-book/', // Replace with your actual repository name
  
  // Configure the markdown parser to use the footnote plugin
  markdown: {
    config: (md) => {
      md.use(footnote)
    }
  },
  
  // Use transformHead to inject script and styles
  transformHead(context) {
    // Add the script tag to the head
    context.head.push(['script', {}, scriptContent]);
    
    // Add embedded view styles directly
    context.head.push(['style', {}, `
      /* Hide navigation elements when embedded */
      .is-embedded .VPNav {
        display: none !important;
      }
      
      .is-embedded .VPSidebar {
        display: none !important;
      }
      
      .is-embedded .VPContent {
        padding-top: 0 !important;
        padding-left: 0 !important;
      }
      
      .is-embedded .VPContent.has-sidebar {
        padding-left: 0 !important;
      }
    `]);
    
    // Check if frontmatter exists before accessing license property
    const frontmatterLicense = context.frontmatter?.license;
    
    // Get license type from frontmatter or default to cc-by
    // Add support for both 3.0 and 4.0 versions
    const licensePath = frontmatterLicense === 'cc-by-sa' ? 'by-sa/4.0' :
                       frontmatterLicense === 'cc-by-nc' ? 'by-nc/4.0' : 
                       frontmatterLicense === 'cc-by-nc-sa' ? 'by-nc-sa/4.0' : 
                       frontmatterLicense === 'cc-by-nd' ? 'by-nd/4.0' : 
                       frontmatterLicense === 'cc-by-nc-nd' ? 'by-nc-nd/4.0' : 
                       // Add 3.0 license versions
                       frontmatterLicense === 'cc-by-3.0' ? 'by/3.0' :
                       frontmatterLicense === 'cc-by-sa-3.0' ? 'by-sa/3.0' :
                       frontmatterLicense === 'cc-by-nc-3.0' ? 'by-nc/3.0' : 
                       frontmatterLicense === 'cc-by-nc-sa-3.0' ? 'by-nc-sa/3.0' : 
                       frontmatterLicense === 'cc-by-nd-3.0' ? 'by-nd/3.0' : 
                       frontmatterLicense === 'cc-by-nc-nd-3.0' ? 'by-nc-nd/3.0' : 
                       'by/4.0'; // Default to CC BY 4.0
    
    // Get author from frontmatter or default to site config
    const pageAuthor = context.frontmatter?.author || 'Michael Collins';
    
    // Add Creative Commons license metadata (respects page-specific license)
    context.head.push(['link', { rel: 'license', href: `http://creativecommons.org/licenses/${licensePath}/` }]);
    
    // Page-specific author metadata
    context.head.push(['meta', { property: 'cc:attributionName', content: pageAuthor }]);
    context.head.push(['meta', { property: 'dc:creator', content: pageAuthor }]);
    context.head.push(['meta', { property: 'schema:author', content: pageAuthor }]);
    
    // URL metadata
    const pageUrl = `https://dmd-program.github.io/dmd-100-book/${context.pageData.relativePath.replace(/\\.md$/, '.html')}`;
    context.head.push(['meta', { property: 'cc:attributionUrl', content: pageUrl }]);
    context.head.push(['meta', { property: 'schema:url', content: pageUrl }]);
    
    // License metadata in multiple formats
    context.head.push(['meta', { name: 'rights', content: `This work is licensed under a Creative Commons License: https://creativecommons.org/licenses/${licensePath}/` }]);
    context.head.push(['meta', { property: 'schema:license', content: `https://creativecommons.org/licenses/${licensePath}/` }]);
  },
  
  themeConfig: {
    // These properties will be accessible via theme in useData()
    license: 'cc-by',
    defaultAuthor: 'Michael Collins',
    workTitle: 'DMD 100: Digital Multimedia Design Foundations',
    // workUrl: 'https://dmd-program.github.io/dmd-100-book',
    siteUrl: 'https://dmd-program.github.io',
    
    // License visibility controls
    showPageLicense: false,      // Controls display of page-specific licenses
    showSitewideLicense: true,  // Controls display of sitewide license
    
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      // Add other top-level navigation if needed
    ],

    // Add search configuration
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        miniSearch: {
          /**
           * @type {import('minisearch').Options}
           * @default
           */
          options: {
            // Advanced search options
            tokenize: (text) => text.split(/\\W+/),
            processTerm: (term) => term.toLowerCase()
          },
          /**
           * @type {import('minisearch').SearchOptions}
           * @default
           */
          searchOptions: {
            // Search options
            boost: { title: 2, content: 1 },
            fuzzy: 0.2,
            prefix: true
          }
        }
      }
    },

    sidebar: [
      {
        text: 'Introduction',
        collapsible: true,
        items: [
          { text: 'Home', link: '/' }, // README.md maps to root
          { text: 'About this course', link: '/introduction/about-this-course' },
          { text: 'Digital Multimedia Design', link: '/introduction/digital_multimedia_design' },
          { text: 'Course instructor', link: '/introduction/instructor' },
          { text: 'Measuring success', link: '/introduction/measuring_success' },
          { text: 'Learning objectives', link: '/introduction/learning-objectives' },
          { text: 'Projects', link: '/introduction/projects' },
          { text: 'Feedback and critique', link: '/introduction/feedback-and-critique' },
          { text: 'Technology', link: '/introduction/technology' },
          { text: 'Writing Guidelines', link: '/introduction/writing_guidelines' },
          { text: 'Requirements', link: '/introduction/requirements' }
        ]
      },
      {
        text: 'Lesson 1: What is design?',
        link: '/lessons/introduction-what-is-design',
        collapsible: true,
        items: [
          {
            text: 'Topics',
            collapsible: true,
            collapsed: true,
            items: [
              { text: 'What is design?', link: '/lessons/lesson-1/topics/what_is_design' },
              { text: 'Design thinking', link: '/lessons/lesson-1/topics/design_thinking' },
              { text: 'Systems thinking', link: '/lessons/lesson-1/topics/systems_thinking' },
              { text: 'Critical thinking', link: '/lessons/lesson-1/topics/critical_thinking' },
              { text: 'Design process', link: '/lessons/lesson-1/topics/design-process' }
            ]
          },
          {
            text: 'Readings',
            collapsible: true,
            collapsed: true,
            items: [
              { text: 'Chapter 1&2. Sen Rikyu...', link: '/lessons/lesson-1/readings/chapter_1_sen_rikyu_and_the_paradox_of_innovation' }
            ]
          },
          {
            text: 'Activities',
            collapsible: true,
            collapsed: true,
            items: [
              { text: 'Daily design journal', link: '/lessons/lesson-1/practice/daily_design_journal' },
              { text: 'Daily design journal: Report in', link: '/lessons/lesson-1/practice/daily-design-journal-report-in' }
            ]
          },
          {
            text: 'Listen',
            collapsible: true,
            collapsed: true,
            items: [
              { text: 'Creative Mornings: Design Is Magical', link: '/lessons/lesson-1/listening/creative_mornings_design_is_magical' },
              { text: '99 Percent Invisible: Lawn Order', link: '/lessons/lesson-1/listening/lawn_order' }
            ]
          },
          {
            text: 'Discussions',
            collapsible: true,
            collapsed: true,
            items: [
              { text: 'End of lesson discussion', link: '/lessons/what-is-design/end_of_lesson_discussion' }
            ]
          }
        ]
      },
      {
        text: 'Lesson 2: Visual and interaction design',
        link: '/lessons/introduction-visual-and-interaction-design',
        collapsible: true,
        items: [
           {
            text: 'Topics',
            collapsible: true,
            collapsed: true,
            items: [
                { text: 'Semiotics', link: '/lessons/lesson-2/topics/semiotics' },
                { text: 'Inclusive design', link: '/lessons/lesson-2/topics/inclusive-design' },
                { text: 'Interaction design', link: '/lessons/lesson-2/topics/interaction_design' },
                { text: 'Critical design', link: '/lessons/lesson-2/topics/critical_design' },
                { text: 'Visual design', link: '/lessons/lesson-2/topics/visual_design' },
                { text: 'Identity design', link: '/lessons/lesson-2/topics/identity-design' }
            ]
           },
           {
            text: 'Readings',
            collapsible: true,
            collapsed: true,
            items: [
                { text: 'Chapter 3. What Design and Truth Say About Each Other', link: '/lessons/lesson-2/readings/chapter_3_what_design_and_truth_say_about_each_other' },
                { text: 'Chapter 4. Design as Tragedy...', link: '/lessons/lesson-2/readings/chapter-4-design-as-tragedy-the-rise-and-fall-of-the-twin-towers' },
                { text: 'Chapter 5. Edsel\'s Law...', link: '/lessons/lesson-2/readings/chapter_5_edsels_law_how_bad_design_happens' },
                { text: 'Chapter 6. Designs of Darkness', link: '/lessons/lesson-2/readings/chapter_6_designs_of_darkness' },
                { text: 'Chapter 7. Face to Face with Design', link: '/lessons/lesson-2/readings/chapter_7_face_to_face_with_design' }
            ]
           },
           {
            text: 'Watch',
            collapsible: true,
            collapsed: true,
            items: [
                { text: 'VOX: It\'s not you. Bad doors are everywhere.', link: '/lessons/lesson-2/watching/vox-its-not-you-bad-doors-are-everywhere' }
            ]
           },
           {
            text: 'Listen',
            collapsible: true,
            collapsed: true,
            items: [
                { text: '99 Percent Invisible: On Average', link: '/lessons/lesson-2/listening/99-percent-invisible-on-average' },
                { text: '99 Percent Invisible: 10,000 Years', link: '/lessons/lesson-2/listening/99_percent_invisible_10,000_years' }
            ]
           },
           {
            text: 'Project',
            collapsible: true,
            collapsed: true,
            items: [
                { text: 'Ritual Project Introduction', link: '/lessons/lesson-2/projects/ritual/ritual_project' },
                { text: 'Ritual Inspiration', link: '/lessons/lesson-2/projects/ritual/ritual-inspiration' },
                { text: 'Discover: Interview', link: '/lessons/lesson-2/projects/ritual/ritual_interview' },
                { text: 'Define: Themes and insights', link: '/lessons/lesson-2/projects/ritual/define-insights' },
                { text: 'Define: HMW', link: '/lessons/lesson-2/projects/ritual/define_hmw' },
                { text: 'Develop: Brainstorm', link: '/lessons/lesson-2/projects/ritual/develop-brainstorm' },
                { text: 'Develop: Storyboard', link: '/lessons/lesson-2/projects/ritual/develop_storyboard' },
                { text: 'Develop: Interactive wireframes', link: '/lessons/lesson-2/projects/ritual/develop_prototype' },
                { text: 'Figma Tutorial', link: '/lessons/lesson-2/projects/ritual/prototype-tutorial' },
                { text: 'Develop: Test and review', link: '/lessons/lesson-2/projects/ritual/develop_test_and_review' },
                { text: 'Develop: Iterate wireframes', link: '/lessons/lesson-2/projects/ritual/develop-iterate-prototype' },
                { text: 'Deliver: Final prototype', link: '/lessons/lesson-2/projects/ritual/deliver-final-prototype' }
            ]
           }
        ]
      },
      {
        text: 'Lesson 3: Storytelling',
        link: '/lessons/introduction-storytelling',
        collapsible: true,
        items: [
            {
                text: 'Topics',
                collapsible: true,
                collapsed: true,
                items: [
                    { text: 'Why stories?', link: '/lessons/lesson-3/topics/narrative' },
                    { text: 'Story structure', link: '/lessons/lesson-3/topics/narrative_structure' },
                    { text: 'Story development', link: '/lessons/lesson-3/topics/organizing_story_development' },
                    { text: 'Character', link: '/lessons/lesson-3/topics/character' },
                    { text: 'Narrative media', link: '/lessons/lesson-3/topics/narrative-media' }
                ]
            },
            {
                text: 'Readings',
                collapsible: true,
                collapsed: true,
                items: [
                    { text: 'Chapter 8. Giorgio Vasari...', link: '/lessons/lesson-3/readings/chapter_8_giorgio_vasari_and_the_permutations_of_design' },
                    { text: 'Chapter 9. The Lady in the Picture...', link: '/lessons/lesson-3/readings/chapter_9_the_lady_in_the_picture_design_and_revelation_in_r' },
                    { text: 'Chapter 10. In Jefferson\'s Footsteps...', link: '/lessons/lesson-3/readings/chapter_10_in_jeffersons_footsteps_modes_of_self-design' }
                ]
            },
            {
                text: 'Watch',
                collapsible: true,
                collapsed: true,
                items: [
                    { text: 'Creative Mornings: Jordan Tannahill', link: '/lessons/lesson-3/watching/creative-mornings-jordan-tannahill' },
                    { text: 'Andrew Stanton: The clues to a great story', link: '/lessons/lesson-3/watching/andrew-stanton-the-clues-to-a-great-story' }
                ]
            },
            {
                text: 'Listen',
                collapsible: true,
                collapsed: true,
                items: [
                    { text: '99 Percent Invisible: Of Mice and Men', link: '/lessons/lesson-3/listening/99_percent_invisible_of_mice_and_men' }
                ]
            },
            {
                text: 'Project',
                collapsible: true,
                collapsed: true,
                items: [
                    { text: 'Hypertext Narrative introduction', link: '/lessons/lesson-3/projects/narrative/hypertext-narrative_civic_imagination_project' },
                    { text: 'Narrative Inspiration', link: '/lessons/lesson-3/projects/narrative/narrative-inspiration' },
                    { text: 'Discover: Word-pairs', link: '/lessons/lesson-3/projects/narrative/discover_focus_words' },
                    { text: 'Define: Synopsis', link: '/lessons/lesson-3/projects/narrative/define_the_way_it_was' },
                    { text: 'Develop: Story and plot elements', link: '/lessons/lesson-3/projects/narrative/develop_story_and_plot' },
                    { text: 'Develop: Characters', link: '/lessons/lesson-3/projects/narrative/develop-characters' },
                    { text: 'Develop: Hypertext narrative draft 1', link: '/lessons/lesson-3/projects/narrative/develop-hypertext-narrative-draft-1' },
                    {
                        text: 'Tutorials',
                        link: '/lessons/lesson-3/projects/narrative/tutorials',
                        collapsible: true,
                        collapsed: true,
                        items: [
                            { text: 'Twine tutorial: Getting started', link: '/lessons/lesson-3/topics/twine-tutorial-getting-started' }
                        ]
                    },
                    { text: 'Develop: Feedback', link: '/lessons/lesson-3/projects/narrative/develop-feedback' },
                    { text: 'Deliver: Hypertext narrative draft 2', link: '/lessons/lesson-3/projects/narrative/deliver-hypertext-narrative-draft-2' }
                ]
            }
        ]
      },
      {
        text: 'Lesson 4: Open design',
        link: '/lessons/introduction-open-design',
        collapsible: true,
        items: [
            {
                text: 'Topics',
                collapsible: true,
                collapsed: true,
                items: [
                    { text: 'Open Design', link: '/lessons/lesson-4/topics/open_design' },
                    { text: 'Into the Open', link: '/lessons/lesson-4/topics/into-the-open' },
                    { text: 'Orchestral Manoeuvres in Design', link: '/lessons/lesson-4/topics/orchestral-manoeuvres-in-design' },
                    { text: 'Authors and Owners', link: '/lessons/lesson-4/topics/authors-and-owners' },
                    { text: 'The Generative Bedrock of Open Design', link: '/lessons/lesson-4/topics/the-generative-bedrock-of-open-design' },
                    { text: 'Design Literacy: Organizing Self-organization', link: '/lessons/lesson-4/topics/design-literacy' },
                    { text: 'Teaching Attitudes, Approaches, Structures and Skills', link: '/lessons/lesson-4/topics/teaching-attitudes-approaches-structures-and-skills' },
                    { text: 'Joris Laarman\'s Experiments with Open Source Design', link: '/lessons/lesson-4/topics/joris-laarmans-experiments-with-open-source-design' }
                ]
            },
            {
                text: 'Watch',
                collapsible: true,
                collapsed: true,
                items: [
                    { text: 'Open Structures: Thomas Lommee', link: '/lessons/lesson-4/watching/open-structures-thomas-lommee' }
                ]
            },
            {
                text: 'Readings',
                collapsible: true,
                collapsed: true,
                items: [
                    { text: 'Chapter 11. Jefferson\'s Gravestone...', link: '/lessons/lesson-4/readings/chapter_11_jeffersons_gravestone_metaphorical_extensions_of_d' },
                    { text: 'Chapter 12. Liberty as Knowledge Design', link: '/lessons/lesson-4/readings/chapter_12_liberty_as_knowledge_design' },
                    { text: 'Chapter 13. Corporate Redesign...', link: '/lessons/lesson-4/readings/chapter_13_corporate_redesign_and_the_business_of_knowledge' },
                    { text: 'Chapter 14. Designing Time', link: '/lessons/lesson-4/readings/chapter_14_designing_time' }
                ]
            },
            {
                text: 'Project',
                collapsible: true,
                collapsed: true,
                items: [
                    { text: 'Open Design Project Introduction', link: '/lessons/lesson-4/projects/open_design/open_design_project' },
                    { text: 'Discover: Toy Design Research', link: '/lessons/lesson-4/projects/open_design/discover-toy-design-research' },
                    { text: 'Discover: Resources', link: '/lessons/lesson-4/projects/open_design/discover_resources' },
                    { text: 'Discover: Modular Design Research', link: '/lessons/lesson-4/projects/open_design/discover-modular-design-research' },
                    { text: 'Define: Product pitch', link: '/lessons/lesson-4/projects/open_design/define-product-pitch' },
                    { text: 'Develop: MVP Prototype', link: '/lessons/lesson-4/projects/open_design/develop_mvp_prototype' },
                    { text: 'Develop: Instructions', link: '/lessons/lesson-4/projects/open_design/develop_instructions' },
                    { text: 'Develop: Test', link: '/lessons/lesson-4/projects/open_design/develop_user_testing' },
                    { text: 'Develop: Iterate', link: '/lessons/lesson-4/projects/open_design/develop-iterate' },
                    { text: 'Deliver: Project documentation', link: '/lessons/lesson-4/projects/open_design/deliver_open_design' }
                ]
            }
        ]
      },
      {
        text: 'Lesson 5: Self design',
        link: '/lessons/introduction-self-design',
        collapsible: true,
        items: [
            {
                text: 'Readings',
                collapsible: true,
                collapsed: true,
                items: [
                    { text: 'Chapter 15. The Design of Private Knowledge', link: '/lessons/lesson-5/readings/chapter_15_the_design_of_private_knowledge' }
                ]
            },
            {
                text: 'Listen',
                collapsible: true,
                collapsed: true,
                items: [
                    { text: 'Creative Mornings: Creativity and the Freedom to Fail', link: '/lessons/lesson-5/listening/creative_mornings_creativity_and_the_freedom_to_fa' },
                    { text: 'Freakonomics: How to Become Great at Just About Anything', link: '/lessons/lesson-5/listening/freakonomics-how-to-become-great-at-just-about-anything' }
                ]
            },
            {
                text: 'Activities',
                collapsible: true,
                collapsed: true,
                items: [
                    { text: 'Pathway design', link: '/lessons/lesson-5/practice/pathway' }
                ]
            }
        ]
      },
      { text: 'License', link: '/LICENSE' } // Assuming LICENSE.md is at the root
    ],

    editLink: {
      pattern: 'https://github.com/dmd-program/dmd-100-book/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    socialLinks: [
      // Add social links if needed, e.g., { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
