(function () {
    'use strict';

    // ============================================================
    // DATA (verbatim from the brand-health-quiz guide)
    // ============================================================

    const QUOTES = [
        {
            author: { ge: 'ჟან-ჟაკ რუსო', en: 'Jean-Jacques Rousseau' },
            text: {
                ge: '„გულწრფელი გული ყოველთვის იპოვის გზას, რომ სხვების გულებამდე მიაღწიოს.“',
                en: '"A sincere heart will always find a way to reach the hearts of others."'
            }
        },
        {
            author: { ge: 'სოკრატე', en: 'Socrates' },
            text: {
                ge: '„გულწრფელობა იწყება იმით, რომ იცოდე, რა არ იცი.“',
                en: '"Sincerity begins with knowing what you do not know."'
            }
        },
        {
            author: { ge: 'ვაჟა-ფშაველა', en: 'Vaja-Pshavela' },
            text: {
                ge: '„გულწრფელი სიტყვა მთას გადაანგრევს, თუ გულიდან მოდის.“',
                en: '"A sincere word can move mountains, if it truly comes from the heart."'
            }
        },
        {
            author: { ge: 'აკაკი წერეთელი', en: 'Akaki Tsereteli' },
            text: {
                ge: '„გულწრფელი სიტყვა ხმალია, რომელიც სიყვარულით ჭრის და სიმართლით კურნავს.“',
                en: '"A sincere word is a sword that cuts with love and heals with truth."'
            }
        },
        {
            author: { ge: 'კონფუცი', en: 'Confucius' },
            text: {
                ge: '„გულწრფელი ადამიანი თავის სიტყვებსა და საქმეებს ერთმანეთთან ამთხვევს.“',
                en: '"A sincere person brings their words and deeds into perfect harmony."'
            }
        }
    ];

    // Score per option: idx 0 = 0 pts, idx 1 = 5 pts, idx 2 = 10 pts. Max = 70.
    const QUESTIONS = [
        {
            q: {
                ge: 'ბრენდის კომუნიკაციისას, რამდენად ფართოა თქვენი სამიზნე აუდიტორია?',
                en: 'Who exactly are you talking to?'
            },
            options: [
                {
                    ge: 'მაქსიმალურად მასშტაბური; ვცდილობთ, ჩვენი გზავნილი ყველასთვის რელევანტური იყოს.',
                    en: 'Everyone. We aim for universal relevance and maximum reach.',
                    feedback: {
                        ge: 'საინტერესოა… პასუხს ყველასგან იღებთ?',
                        en: 'If you\'re talking to everyone, nobody is really listening.'
                    }
                },
                {
                    ge: 'ფოკუსირებული ვართ კონკრეტულ სეგმენტებზე (მაგ: მაღალშემოსავლიანი პროფესიონალები).',
                    en: 'We focus on high-value, specific demographics.',
                    feedback: {
                        ge: 'ზუსტი სეგმენტაცია. ეფექტური მიდგომაა.',
                        en: 'Precision is profitable. You\'re on the right track.'
                    }
                },
                {
                    ge: 'ვმუშაობთ ვიწრო ნიშაზე, რომელიც სრულად იზიარებს ჩვენს ხედვებსა და ფასეულობებს.',
                    en: 'We serve a narrow niche that shares our specific vision and values.',
                    feedback: {
                        ge: 'ექსკლუზიურია. ჩათვალეთ ეს თქვენი მთავარი სუპერძალაა.',
                        en: 'A niche isn\'t a limitation; it\'s a stronghold.'
                    }
                }
            ]
        },
        {
            q: {
                ge: 'რომელი ფრაზა აღწერს ყველაზე გულწრფელად თქვენს როლს ბაზარზე?',
                en: 'Which statement best describes your current role in the industry?'
            },
            options: [
                {
                    ge: 'ჩვენ ვართ ერთ-ერთი მრავალთაგან, რომელიც სტაბილურად მიჰყვება ბაზრის სტანდარტებს.',
                    en: 'We\'re a reliable player following established market norms.',
                    feedback: {
                        ge: 'სტაბილურია, თუმცა უხილავი. ბაზარი თქვენს ჩანაცვლებას წამებში შეძლებს.',
                        en: 'Stable, sure. But invisibility is the ultimate business risk.'
                    }
                },
                {
                    ge: 'ჩვენ აქტიურად ვცდილობთ საკუთარი, განსხვავებული ნიშის პოვნას, თუმცა საბოლოოდ მაინც უსაფრთხო გზას ვირჩევთ.',
                    en: 'We\'re hunting for a unique niche, but we usually default to the "safe" route.',
                    feedback: {
                        ge: 'კარგი ბალანსია. პოტენციალი იგრძნობა.',
                        en: 'You have the spark. Now, stop holding back.'
                    }
                },
                {
                    ge: 'ჩვენ ვართ „მეამბოხე“ ბრენდი, რომელიც ცვლის თამაშის წესებს. ჩვენი არარსებობა ინდუსტრიას მოსაწყენს გახდიდა…',
                    en: 'We\'re the "rebel" brand rewriting the rules. The industry would be a lot quieter without us.',
                    feedback: {
                        ge: 'მარტი ნიუმაიერი თქვენით იამაყებდა.',
                        en: 'Marty Neumeier would be proud.'
                    }
                }
            ]
        },
        {
            q: {
                ge: 'რა არის თქვენი პროდუქტის/სერვისის არსებობის მთავარი დასტური ბაზარზე?',
                en: 'What is the primary reason your brand exists in the market today?'
            },
            options: [
                {
                    ge: 'ჩვენს პროდუქტს/სერვისს ყიდულობენ მხოლოდ მაშინ, როცა კონკრეტული პრობლემის გადაჭრა სურთ (მაგ. „მჭირდება ბინა“).',
                    en: 'People only come to us to solve a specific, immediate problem (e.g., "I just need an apartment").',
                    feedback: {
                        ge: 'როცა მომხმარებელთან მხოლოდ საჭიროება გაკავშირებთ, ერთგულებაზე საუბარი რთულია.',
                        en: 'When necessity is your only tether to a customer, loyalty is just a transaction.'
                    }
                },
                {
                    ge: 'მომხმარებლები გვირჩევენ რეკომენდაციით, რადგან იციან, რომ ჩვენი შესრულება სტანდარტზე მაღალია.',
                    en: 'Clients choose us because our execution consistently outpaces the industry standard.',
                    feedback: {
                        ge: 'კარგი პროდუქტი თავისით ლაპარაკობს, მაგრამ ხანდახან ხმამაღალი საუბარიც საჭიროა.',
                        en: 'A solid reputation is a great floor, but it\'s a boring ceiling.'
                    }
                },
                {
                    ge: 'ჩვენი პროდუქტი მომხმარებლისთვის ცხოვრების სტილის ნაწილია; ისინი მზად არიან მოიცადონ ან მეტი გადაიხადონ მხოლოდ ჩვენი ხელწერის გამო.',
                    en: 'We are part of our customers\' worldview; they\'ll pay a premium or wait in line just for our signature.',
                    feedback: {
                        ge: 'ეს უკვე ბრენდინგის უმაღლესი ლიგაა. თქვენ ლოგოს მიღმაც არსებობთ.',
                        en: 'This is the big league. You exist as a meaning, not just a line item.'
                    }
                }
            ]
        },
        {
            q: {
                ge: 'რამდენად არის თქვენი მარკეტინგი კომპანიის შიდა კულტურის სარკე?',
                en: 'Is your marketing an honest reflection of your internal culture?'
            },
            options: [
                {
                    ge: 'ჩვენი კომუნიკაცია ორიენტირებულია მხოლოდ მომხმარებლის მოლოდინებზე.',
                    en: 'Our communication is dictated strictly by what the customer expects to hear.',
                    feedback: {
                        ge: 'კარგად უსმენთ ბაზარს. ახლა კი დროა საკუთარ თავსაც მოუსმინოთ.',
                        en: 'Listening to the market is smart; losing your own voice is a tragedy.'
                    }
                },
                {
                    ge: 'ვცდილობთ ვიყოთ გულწრფელები, თუმცა ხშირად ფორმალური ჩარჩოებით ვიზღუდებით.',
                    en: 'We try to be transparent, but we often get stuck behind "corporate" filters.',
                    feedback: {
                        ge: 'გულწრფელობის სურვილი უკვე ბევრს ნიშნავს.',
                        en: 'The urge to be honest is there. It\'s time to break the filter.'
                    }
                },
                {
                    ge: 'მარკეტინგი შიდა კულტურის პირდაპირი ანარეკლია; ჩვენ ვსაუბრობთ საკუთარ ღირებულებებზე მაშინაც კი, თუ ეს ყველასთვის მისაღები არ არის.',
                    en: 'Our marketing is a raw reflection of our values—even if it ruffles a few feathers.',
                    feedback: {
                        ge: 'ჩათვალეთ, ძლიერი ბრენდის დეფინიცია ხართ.',
                        en: 'A brand with a spine is a brand people actually respect.'
                    }
                }
            ]
        },
        {
            q: {
                ge: 'როცა თქვენს ინდუსტრიაში „დიდი მოთამაშეები“ ახალ ტრენდს იწყებენ, რა არის თქვენი პირველი ინსტინქტი?',
                en: 'How do you react when the \'market leaders\' launch a new trend?'
            },
            options: [
                {
                    ge: 'მალევე ავყვებით ტრენდს, რათა ბაზარზე არ ჩამოვრჩეთ.',
                    en: 'We pivot quickly to ensure we don\'t look outdated.',
                    feedback: {
                        ge: 'დინამიურია. ყოველთვის აქტუალური ხართ.',
                        en: 'Agility is great, but don\'t lose your North Star in the shuffle.'
                    }
                },
                {
                    ge: 'ვადაპტირდებით, თუმცა ჩვენს ხელწერასაც ვამატებთ.',
                    en: 'We adopt what works but always add our own signature.',
                    feedback: {
                        ge: 'გონივრული არჩევანია. საკუთარ სტილს ინარჩუნებთ.',
                        en: 'Smart. You know how to play the game without losing your soul.'
                    }
                },
                {
                    ge: 'განზრახ საპირისპირო მიმართულებით მივდივართ, რათა ჩვენი „ერთადერთობა“ დავამკვიდროთ.',
                    en: 'We deliberately head the other way to double down on our "onliness."',
                    feedback: {
                        ge: 'ინდივიდუალიზმი ბრენდინგში ყველაზე მეტად ფასდება.',
                        en: 'Differentiation is the only sustainable competitive advantage.'
                    }
                }
            ]
        },
        {
            q: {
                ge: 'თქვენს საკომუნიკაციო მასალაში კონკურენტის ლოგო რომ ჩავსვათ, იქნება თუ არა განსხვავება შესამჩნევი?',
                en: 'If we stripped your logo from your content, would your audience still recognize you?'
            },
            options: [
                {
                    ge: 'განსხვავების პოვნა რთული იქნება, რადგან ინდუსტრიის სტანდარტები ერთგვაროვან სტილს გვკარნახობს.',
                    en: 'Probably not; industry standards make most of us look the same.',
                    feedback: {
                        ge: 'სტანდარტს კარგად ფლობთ. ახლა დროა განვითარებაზე იფიქროთ.',
                        en: 'Mastering the standard is the first step toward breaking it.'
                    }
                },
                {
                    ge: 'შესაძლებელია, თუმცა განსხვავება ძირითადად ვიზუალურ დეტალებში (ფერები, სტილი) გამოიხატება.',
                    en: 'Maybe, but mostly because of our color palette or specific fonts.',
                    feedback: {
                        ge: 'გემოვნებიანია. ესთეტიკა თქვენი მთავარი მოკავშირეა.',
                        en: 'Aesthetics are a good start; identity is the finish line.'
                    }
                },
                {
                    ge: 'სხვაობა თვალსაჩინო იქნება. ჩვენი ტონი, ლექსიკა და მსოფლხედვა რადიკალურად განსხვავებულია.',
                    en: 'Absolutely. Our tone, voice, and worldview are impossible to copy.',
                    feedback: {
                        ge: 'ეფლის მარკეტინგის გუნდიდან ხართ? აღიარეთ.',
                        en: 'If you sound like yourself even without a logo, you\'ve already won.'
                    }
                }
            ]
        },
        {
            q: {
                ge: 'რა რეაქცია ექნებოდა თქვენს აუდიტორიას, თქვენი ბრენდი ბაზრიდან რომ გამქრალიყო?',
                en: 'What happens if your brand disappears tomorrow?'
            },
            options: [
                {
                    ge: 'ისინი მარტივად ჩანაცვლებდნენ ჩვენს ბრენდს სხვა კონკურენტით.',
                    en: 'Customers would migrate to a competitor without a second thought.',
                    feedback: {
                        ge: 'ბევრ რამეზეა სამუშაო…',
                        en: 'Ouch. That\'s the definition of a commodity, not a brand.'
                    }
                },
                {
                    ge: 'იგრძნობით დანაკლისს და დაიწყებდნენ მსგავსი ღირებულებების მქონე ალტერნატივის ძიებას.',
                    en: 'They\'d feel the loss and start hunting for a "similar" alternative.',
                    feedback: {
                        ge: 'თითქმის შეუცვლელი ხართ.',
                        en: 'You\'re close to being a "must-have." Just one more push.'
                    }
                },
                {
                    ge: 'ეს მათთვის იდენტობის ნაწილის დაკარგვა იქნებოდა, ვინაიდან ჩვენს გამოცდილებას სხვაგან ვერ მიიღებენ.',
                    en: 'They\'d lose a piece of their own identity. We are irreplaceable.',
                    feedback: {
                        ge: 'დარწმუნებული ხართ რომ ჩვენი სერვისები გჭირდებათ?',
                        en: 'If you\'re this confident, maybe we should be taking tips from you.'
                    }
                }
            ]
        }
    ];

    const VERDICTS = [
        {
            range: [10, 30],
            label: {
                ge: 'ფუნდამენტური რევიზია',
                en: 'Fundamental Overhaul'
            },
            ge: 'თქვენი ბრენდი ამჟამად ბაზრის ხმაურში <span class="hl">იკარგება</span>. ეს არ ნიშნავს, რომ პროდუქტია ცუდი, უბრალოდ მას აკლია მკაფიო <span class="hl">„ხერხემალი“</span>, რომელიც მომხმარებელს თქვენს <span class="hl">დამახსოვრებას აიძულებს</span>.',
            en: 'Your brand is currently getting lost in the <span class="hl">market noise</span>. This doesn\'t mean your product is bad; it simply lacks the strategic <span class="hl">"spine"</span> required to make you <span class="hl">memorable</span>. You are operating as a <span class="hl">commodity</span> in a world that rewards identity.'
        },
        {
            range: [31, 60],
            label: {
                ge: 'ზრდის პოტენციალი',
                en: 'Growth Potential'
            },
            ge: 'მიუხედავად ფუნდამენტური სიმყარისა, თქვენს ბრენდს აქვს <span class="hl">უდიდესი პოტენციალი</span>, გახდეს ბევრად უფრო <span class="hl">კონკურენტუნარიანი</span>. საფუძველი არსებობს, თუმცა სტრატეგიული აქცენტები დასაზუსტებელია, რათა თქვენი ხედვა მომხმარებლამდე <span class="hl">უდანაკარგოდ</span> მივიდეს.',
            en: 'You have a <span class="hl">solid foundation</span>, but there is significant room to sharpen your <span class="hl">competitive edge</span>. The core is there, but your strategic focus needs to be tightened to ensure your vision reaches the customer <span class="hl">without getting diluted</span>.'
        },
        {
            range: [61, 80],
            label: {
                ge: 'სტრატეგიული ოპტიმიზაცია',
                en: 'Strategic Optimization'
            },
            ge: 'თქვენი ბრენდი <span class="hl">ჯანსაღია</span> და ბაზარზე თავდაჯერებულად დგას. თუმცა, რესურსის სრულად ასათვისებლად საჭიროა იმ <span class="hl">ნიუანსების დახვეწა</span>, რომლებიც ბრენდის აღქმას <span class="hl">უფრო მკაფიოს ხდის</span> და პოზიციონირებას სიმყარეს მატებს.',
            en: 'Your brand is <span class="hl">healthy</span> and holds its ground with confidence. To fully capitalize on your resources, you now need to <span class="hl">refine the nuances</span>—the small details that turn a clear brand into an <span class="hl">unmistakable one</span>.'
        },
        {
            range: [81, 100],
            label: {
                ge: 'სისტემური ლიდერობა',
                en: 'Rare Air'
            },
            ge: 'თუ აქამდე თავდაჯერებულად მოხვედით, ჩვენი სერვისები <span class="hl">ნამდვილად არ გჭირდებათ</span>. ნებისმიერ შემთხვევაში, მოხარული ვიქნებით, პირადად გავიცნოთ ასეთი <span class="hl">ძლიერი ბრენდი</span>.',
            en: 'If you\'ve made it this far with total honesty, you <span class="hl">probably don\'t need</span> our services. Regardless, we\'d love to personally meet a <span class="hl">brand this strong</span>.'
        }
    ];

    const FINAL_COPY = {
        ge: 'სტრატეგია <span class="hl">კომფორტის ზონიდან გამოსვლაა</span>. თუ ამ ციფრებმა ცოტათი მაინც შეგაშინათ — ეს კარგის ნიშანია და ნიშნავს, რომ <span class="hl">ცოცხალი ორგანიზმი</span> გაბარიათ.<br><br>'
          + 'ეს კი მხოლოდ <span class="hl">აისბერგის მწვერვალია</span>. თუ ბრენდის სტრატეგიის ამ მცირედმა ნაწილმა დაგაინტერესათ და მზად ხართ <span class="hl">უფრო ღრმა სტრატეგიული ანალიზისთვის</span>.',
        en: 'Strategy is about <span class="hl">leaving your comfort zone</span>. If these numbers made you feel even slightly uneasy—good. It\'s a sign that you\'re managing a <span class="hl">living organism</span>, not a static machine.<br><br>'
          + 'This is just the <span class="hl">tip of the iceberg</span>. If this brief diagnostic sparked a need for <span class="hl">deeper reflection</span>, let\'s go further.'
    };

    // ============================================================
    // STATE
    // ============================================================

    const state = {
        lang: 'ge',
        qIndex: 0,
        score: 0,
        lastFeedback: null
    };

    // ============================================================
    // ELEMENTS
    // ============================================================

    const body = document.body;
    const screens = {
        landing: document.getElementById('screen-landing'),
        quote: document.getElementById('screen-quote'),
        question: document.getElementById('screen-question'),
        feedback: document.getElementById('screen-feedback'),
        results: document.getElementById('screen-results'),
        final: document.getElementById('screen-final')
    };

    const progressDots = document.querySelectorAll('.progress-dots .dot');

    // ============================================================
    // LANGUAGE
    // ============================================================

    function applyLang() {
        body.setAttribute('data-lang', state.lang);

        document.querySelectorAll('[data-ge][data-en]').forEach(el => {
            const val = el.getAttribute('data-' + state.lang);
            if (val !== null) el.textContent = val;
        });

        // Re-render current question / feedback / results on language change
        if (screens.question.classList.contains('active')) renderQuestion();
        if (screens.feedback.classList.contains('active') && state.lastFeedback) {
            document.getElementById('feedback-text').textContent = state.lastFeedback[state.lang];
        }
        if (screens.results.classList.contains('active')) {
            const verdict = getVerdict(state.lastPercent || 19);
            document.getElementById('result-label').textContent = verdict.label[state.lang];
            document.getElementById('result-verdict').innerHTML = verdict[state.lang];
        }
        if (screens.final.classList.contains('active')) renderFinal();
        if (screens.quote.classList.contains('active') && state.lastQuote) {
            document.getElementById('quote-text').textContent = state.lastQuote.text[state.lang];
            document.getElementById('quote-author').textContent = state.lastQuote.author[state.lang];
        }
    }

    const langToggle = document.getElementById('lang-toggle');
    const bracketL = langToggle.querySelector('.lang-bracket-l');
    const bracketR = langToggle.querySelector('.lang-bracket-r');

    function updateBracketPositions() {
        const active = langToggle.querySelector('.lang-btn.active');
        if (!active || !bracketL || !bracketR) return;
        const toggleRect = langToggle.getBoundingClientRect();
        const btnRect = active.getBoundingClientRect();
        const leftX = btnRect.left - toggleRect.left - bracketL.offsetWidth + 4;
        const rightX = btnRect.right - toggleRect.left - 4;
        bracketL.style.left = leftX + 'px';
        bracketR.style.left = rightX + 'px';
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (lang === state.lang) return;
            state.lang = lang;
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b === btn));
            updateBracketPositions();
            applyLang();
            requestAnimationFrame(() => {
                sizeWallsTo(document.querySelector('.quiz-screen.active'));
            });
        });
    });

    // ============================================================
    // SCREEN SWITCHING
    // ============================================================

    const stage = document.getElementById('quiz-stage');
    const wallLeft = document.querySelector('.wall-left');
    const wallRight = document.querySelector('.wall-right');

    function sizeWallsTo(screenEl) {
        if (!screenEl) return;
        const frame = screenEl.querySelector('.quiz-frame');
        if (!frame) return;
        const w = frame.offsetWidth;
        const h = frame.offsetHeight;
        const arm = 40;
        const inset = 3.5; // keeps rounded stroke caps fully visible inside the viewBox
        [wallLeft, wallRight].forEach(el => {
            el.style.setProperty('--frame-w', w + 'px');
            el.style.setProperty('--frame-h', h + 'px');
            // Redraw SVG path so arms stay at the top/bottom regardless of frame height
            el.setAttribute('viewBox', '0 0 ' + arm + ' ' + h);
            const path = el.querySelector('path');
            if (!path) return;
            const isLeft = el.classList.contains('wall-left');
            const d = isLeft
                ? 'M' + (arm - inset) + ' ' + inset + ' H' + inset + ' V' + (h - inset) + ' H' + (arm - inset)
                : 'M' + inset + ' ' + inset + ' H' + (arm - inset) + ' V' + (h - inset) + ' H' + inset;
            path.setAttribute('d', d);
        });
    }

    function showScreen(name) {
        const outgoing = document.querySelector('.quiz-screen.active');
        const incoming = screens[name];
        if (outgoing === incoming) return;

        sizeWallsTo(incoming);

        Object.keys(screens).forEach(k => {
            screens[k].classList.toggle('active', k === name);
        });

        body.classList.remove('phase-landing', 'phase-quote', 'phase-question', 'phase-feedback', 'phase-results', 'phase-final');
        body.classList.add('phase-' + name);

        if (name === 'results') animatePercent(state.lastPercent || 19);

        window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

        // Re-measure after layout settles (fixes first-popup height mismatch
        // when the frame was just populated or fonts finished loading)
        requestAnimationFrame(() => {
            sizeWallsTo(incoming);
        });

        // If custom fonts weren't ready yet, measurements use fallback metrics.
        // Re-measure once fonts finish so walls match the final text height.
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                if (incoming.classList.contains('active')) {
                    sizeWallsTo(incoming);
                }
            });
        }
    }

    // Resync walls + bracket positions on resize
    window.addEventListener('resize', () => {
        const active = document.querySelector('.quiz-screen.active');
        sizeWallsTo(active);
        updateBracketPositions();
    });

    // ============================================================
    // PROGRESS DOTS
    // ============================================================

    function updateProgress() {
        progressDots.forEach((dot, i) => {
            dot.classList.remove('active', 'done');
            if (i < state.qIndex) dot.classList.add('done');
            else if (i === state.qIndex) dot.classList.add('active');
        });
    }

    // ============================================================
    // FLOW
    // ============================================================

    document.getElementById('start-btn').addEventListener('click', () => {
        showQuote(() => startQuiz());
    });

    function showQuote(done) {
        state.lastQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        document.getElementById('quote-text').textContent = state.lastQuote.text[state.lang];
        document.getElementById('quote-author').textContent = state.lastQuote.author[state.lang];
        showScreen('quote');
        setTimeout(done, 4000);
    }

    function startQuiz() {
        state.qIndex = 0;
        state.score = 0;
        renderQuestion();
    }

    function renderQuestion() {
        const item = QUESTIONS[state.qIndex];
        document.getElementById('question-title').textContent = item.q[state.lang];

        const list = document.getElementById('answer-list');
        list.innerHTML = '';
        item.options.forEach((opt, idx) => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'answer-option';
            btn.textContent = opt[state.lang];
            btn.addEventListener('click', () => selectAnswer(idx));
            li.appendChild(btn);
            list.appendChild(li);
        });

        updateProgress();
        showScreen('question');
    }

    function selectAnswer(idx) {
        const points = [0, 5, 10][idx];
        state.score += points;

        const opt = QUESTIONS[state.qIndex].options[idx];
        state.lastFeedback = opt.feedback;
        document.getElementById('feedback-text').textContent = opt.feedback[state.lang];
        showScreen('feedback');
        // No auto-advance — user clicks the arrow (feedback-next-btn) to continue.
    }

    function advanceFromFeedback() {
        state.qIndex++;
        if (state.qIndex >= QUESTIONS.length) {
            renderResults();
            showScreen('results');
        } else {
            renderQuestion();
        }
    }

    document.getElementById('result-next-btn').addEventListener('click', () => {
        renderFinal();
        showScreen('final');
    });

    document.getElementById('feedback-next-btn').addEventListener('click', advanceFromFeedback);

    document.getElementById('final-prev-btn').addEventListener('click', () => {
        showScreen('results');
    });

    // ============================================================
    // RESULTS
    // ============================================================

    function getVerdict(percent) {
        return VERDICTS.find(v => percent >= v.range[0] && percent <= v.range[1]) || VERDICTS[0];
    }

    function renderResults() {
        // Formula: (score / 70) * 100, displayed with a 19% floor.
        const raw = Math.round((state.score / 70) * 100);
        const percent = Math.max(19, raw);
        state.lastPercent = percent;
        document.getElementById('result-percent').textContent = '0%';

        const verdict = getVerdict(percent);
        document.getElementById('result-label').textContent = verdict.label[state.lang];
        document.getElementById('result-verdict').innerHTML = verdict[state.lang];
    }

    let percentAnimId = null;
    function animatePercent(target) {
        const el = document.getElementById('result-percent');
        if (percentAnimId) cancelAnimationFrame(percentAnimId);

        const duration = 1400;
        const start = performance.now();

        function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

        function tick(now) {
            const t = Math.min(1, (now - start) / duration);
            const current = Math.round(easeOutCubic(t) * target);
            el.textContent = current + '%';
            if (t < 1) {
                percentAnimId = requestAnimationFrame(tick);
            } else {
                percentAnimId = null;
            }
        }

        // brief pause before the count begins so the screen transition settles
        setTimeout(() => {
            percentAnimId = requestAnimationFrame(tick);
        }, 250);
    }

    function renderFinal() {
        document.getElementById('final-text').innerHTML = FINAL_COPY[state.lang];
        const bookBtn = document.getElementById('book-btn');
        bookBtn.textContent = bookBtn.getAttribute('data-' + state.lang);
    }

    // ============================================================
    // MENU TOGGLE
    // ============================================================

    const menuToggle = document.getElementById('menu-toggle');
    const offCanvasMenu = document.getElementById('off-canvas-menu');
    const dimmer = document.getElementById('dimmer-overlay');

    function openMenu() {
        offCanvasMenu.classList.add('open');
        menuToggle.classList.add('open');
        body.classList.add('menu-open');
    }

    function closeMenu() {
        offCanvasMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        body.classList.remove('menu-open');
    }

    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (offCanvasMenu.classList.contains('open')) closeMenu();
        else openMenu();
    });

    // Hover — any device that actually supports hover (mouse-capable).
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    menuToggle.addEventListener('mouseenter', () => { if (hoverQuery.matches) openMenu(); });
    offCanvasMenu.addEventListener('mouseleave', () => { if (hoverQuery.matches) closeMenu(); });

    document.querySelectorAll('.menu-links a').forEach(a => a.addEventListener('click', closeMenu));
    if (dimmer) dimmer.addEventListener('click', closeMenu);

    // ============================================================
    // INIT
    // ============================================================

    applyLang();
    body.classList.add('phase-landing');

    // Measure landing frame after layout, then size walls + place brackets
    requestAnimationFrame(() => {
        sizeWallsTo(screens.landing);
        updateBracketPositions();
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            const active = document.querySelector('.quiz-screen.active');
            if (active) sizeWallsTo(active);
            updateBracketPositions();
        });
    }
})();
