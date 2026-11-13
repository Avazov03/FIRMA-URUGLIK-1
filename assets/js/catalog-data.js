/* Products and services shown on shop-details.html?id= and service-details.html?id= */
(function () {
  var CATEGORIES = {
    uruglik: { uz: "Urug'lik", ru: "Семена", en: "Seeds" },
    galla: { uz: "Galla", ru: "Зерно", en: "Grain" },
    ogit: { uz: "O'g'itlar", ru: "Удобрения", en: "Fertilizers" },
    himoya: { uz: "Himoya vositalari", ru: "Средства защиты", en: "Crop protection" },
    ozuqa: { uz: "Ozuqa", ru: "Корм", en: "Feed" },
  };

  var PRICE = { uz: "Narx so'rov asosida", ru: "Цена по запросу", en: "Price on request" };

  var FEATURES = {
    uruglik: {
      uz: ["Fermer va korxonalar uchun ulgurji hajm", "Nav va partiya so'rov bo'yicha aniqlanadi", "Narx hajm va muddatga qarab kelishiladi"],
      ru: ["Оптовые объёмы для фермеров и компаний", "Сорт и партия уточняются по запросу", "Цена зависит от объёма и срока"],
      en: ["Wholesale volumes for farmers and companies", "Variety and lot are confirmed on request", "Price depends on volume and timing"],
    },
    galla: {
      uz: ["Ulgurji partiyalar bo'yicha savdo", "Sifat ko'rsatkichlari so'rov bo'yicha aniqlanadi", "Narx hajm va muddatga qarab kelishiladi"],
      ru: ["Торговля оптовыми партиями", "Показатели качества уточняются по запросу", "Цена зависит от объёма и срока"],
      en: ["Trade in wholesale lots", "Quality parameters are confirmed on request", "Price depends on volume and timing"],
    },
    ogit: {
      uz: ["Ulgurji hajmda ta'minot", "Turi va qadoqlash so'rov bo'yicha aniqlanadi", "Narx hajm va muddatga qarab kelishiladi"],
      ru: ["Оптовые поставки", "Вид и фасовка уточняются по запросу", "Цена зависит от объёма и срока"],
      en: ["Wholesale supply", "Type and packaging are confirmed on request", "Price depends on volume and timing"],
    },
    himoya: {
      uz: ["Ulgurji hajmda ta'minot", "Preparat va qo'llash me'yorini mutaxassis bilan kelishing", "Narx hajm va muddatga qarab kelishiladi"],
      ru: ["Оптовые поставки", "Препарат и норму применения согласуйте со специалистом", "Цена зависит от объёма и срока"],
      en: ["Wholesale supply", "Agree the product and application rate with a specialist", "Price depends on volume and timing"],
    },
    ozuqa: {
      uz: ["Chorvachilik xo'jaliklari uchun ulgurji hajm", "Tarkib va qadoqlash so'rov bo'yicha aniqlanadi", "Narx hajm va muddatga qarab kelishiladi"],
      ru: ["Оптовые объёмы для животноводческих хозяйств", "Состав и фасовка уточняются по запросу", "Цена зависит от объёма и срока"],
      en: ["Wholesale volumes for livestock farms", "Composition and packaging are confirmed on request", "Price depends on volume and timing"],
    },
  };

  function lead(lang, name, cat) {
    var c = CATEGORIES[cat][lang];
    if (lang === "ru")
      return name + " — позиция каталога AGRO EXPORT GROUP в разделе «" + c + "». Оптовые поставки: объём, партия и срок поставки согласуются по запросу.";
    if (lang === "en")
      return name + " is listed in the AGRO EXPORT GROUP catalogue under " + c + ". Wholesale supply: volume, lot and delivery timing are agreed on request.";
    return name + " — AGRO EXPORT GROUP katalogidagi «" + c + "» bo'limi mahsuloti. Ulgurji ta'minot: hajm, partiya va yetkazib berish muddati so'rov asosida kelishiladi.";
  }

  var ORDER = {
    uz: "Buyurtma tartibi oddiy: so'rov yuboring va mahsulot, kerakli hajm hamda yetkazib berish manzilini ko'rsating. Shundan so'ng assortiment, narx va muddatni kelishamiz, keyin mahsulotni kelishilgan hajmda yetkazib beramiz.",
    ru: "Порядок заказа простой: отправьте запрос и укажите продукт, нужный объём и адрес поставки. Затем мы согласуем ассортимент, цену и срок и поставим продукцию в согласованном объёме.",
    en: "Ordering is simple: send a request with the product, the volume you need and the delivery address. We then agree the range, price and timing, and deliver the agreed volume.",
  };

  var PLACEHOLDER = "assets/img/shop/placeholder-seed.svg";

  var PRODUCTS = [
    { id: "bugdoy-urugi", cat: "uruglik", img: "assets/img/shop/cat-galla-1.png", uz: "Bug'doy urug'i", ru: "Семена пшеницы", en: "Wheat seed" },
    { id: "makka-urugi", cat: "uruglik", img: "assets/img/shop/real-galla-makka.png", uz: "Makka urug'i", ru: "Семена кукурузы", en: "Maize seed" },
    { id: "paxta-urugi", cat: "uruglik", img: PLACEHOLDER, uz: "Paxta urug'i", ru: "Семена хлопчатника", en: "Cotton seed" },
    { id: "arpa-urugi", cat: "uruglik", img: "assets/img/shop/cat-galla-2.png", uz: "Arpa urug'i", ru: "Семена ячменя", en: "Barley seed" },
    { id: "noxat-urugi", cat: "uruglik", img: PLACEHOLDER, uz: "No'xat urug'i", ru: "Семена нута", en: "Chickpea seed" },
    { id: "sabzi-urugi", cat: "uruglik", img: "assets/img/shop/shop-1.png", uz: "Sabzi urug'i", ru: "Семена моркови", en: "Carrot seed" },
    { id: "pomidor-urugi", cat: "uruglik", img: "assets/img/shop/shop-8.png", uz: "Pomidor urug'i", ru: "Семена томата", en: "Tomato seed" },
    { id: "piyoz-urugi", cat: "uruglik", img: "assets/img/shop/shop-9.png", uz: "Piyoz urug'i", ru: "Семена лука", en: "Onion seed" },
    { id: "kartoshka-urugi", cat: "uruglik", img: "assets/img/shop/shop-10.png", uz: "Kartoshka urug'i", ru: "Семенной картофель", en: "Potato seed" },
    { id: "kivi-urugi", cat: "uruglik", img: "assets/img/shop/shop-11.png", uz: "Kivi urug'i", ru: "Семена киви", en: "Kiwi seed" },
    { id: "guava-urugi", cat: "uruglik", img: "assets/img/shop/shop-12.png", uz: "Guava urug'i", ru: "Семена гуавы", en: "Guava seed" },
    { id: "bugdoy", cat: "galla", img: "assets/img/shop/cat-galla-1.png", uz: "Bug'doy (galla)", ru: "Пшеница (зерно)", en: "Wheat (grain)" },
    { id: "arpa", cat: "galla", img: "assets/img/shop/cat-galla-2.png", uz: "Arpa", ru: "Ячмень", en: "Barley" },
    { id: "makka", cat: "galla", img: "assets/img/shop/real-galla-makka.png", uz: "Makka (galla)", ru: "Кукуруза (зерно)", en: "Maize (grain)" },
    { id: "sholi", cat: "galla", img: "assets/img/shop/real-galla-sholi.png", uz: "Sholi", ru: "Рис", en: "Rice" },
    { id: "suli", cat: "galla", img: "assets/img/shop/real-galla-suli.png", uz: "Suli", ru: "Овёс", en: "Oats" },
    { id: "javdar", cat: "galla", img: "assets/img/shop/real-galla-javdar.png", uz: "Javdar", ru: "Рожь", en: "Rye" },
    { id: "azotli-ogit", cat: "ogit", img: "assets/img/shop/real-ogit-azot.png", uz: "Azotli o'g'it", ru: "Азотное удобрение", en: "Nitrogen fertilizer" },
    { id: "fosforli-ogit", cat: "ogit", img: "assets/img/shop/real-ogit-fosfor.png", uz: "Fosforli o'g'it", ru: "Фосфорное удобрение", en: "Phosphate fertilizer" },
    { id: "kompleks-ogit", cat: "ogit", img: "assets/img/shop/real-ogit-kompleks.png", uz: "Kompleks o'g'it", ru: "Комплексное удобрение", en: "Compound fertilizer" },
    { id: "gerbitsid", cat: "himoya", img: "assets/img/shop/real-himoya-gerb.png", uz: "Gerbitsid", ru: "Гербицид", en: "Herbicide" },
    { id: "fungitsid", cat: "himoya", img: "assets/img/shop/real-himoya-fung.png", uz: "Fungitsid", ru: "Фунгицид", en: "Fungicide" },
    { id: "insektitsid", cat: "himoya", img: "assets/img/shop/real-himoya-insekt.png", uz: "Insektitsid", ru: "Инсектицид", en: "Insecticide" },
    { id: "chorva-ozuqasi", cat: "ozuqa", img: "assets/img/shop/real-ozuqa-1.png", uz: "Chorva ozuqasi", ru: "Корм для скота", en: "Livestock feed" },
    { id: "aralash-ozuqa", cat: "ozuqa", img: "assets/img/shop/real-ozuqa-2.png", uz: "Aralash ozuqa", ru: "Комбикорм", en: "Compound feed" },
  ];

  var SERVICES = [
    {
      id: "uruglik",
      img: "assets/img/service/service-img-9.jpg",
      link: "shop.html?cat=uruglik",
      uz: {
        title: "Urug'lik ta'minoti",
        heading: "Fermer va korxonalar uchun urug'lik — ulgurji hajmda",
        p1: "AGRO EXPORT GROUP fermer xo'jaliklari va korxonalarga urug'lik mahsulotlarini ulgurji hajmda yetkazib beradi. Katalogda don, sabzavot va texnik ekinlar urug'lari bor.",
        p2: "Nav, partiya hajmi va yetkazib berish muddati har bir so'rov bo'yicha alohida kelishiladi.",
        list: ["Bug'doy, makka, arpa va paxta urug'lari", "Sabzavot urug'lari: pomidor, piyoz, sabzi", "Hajm va muddat bo'yicha kelishuv", "Tanlashda amaliy maslahat"],
        p3: "Buyurtma uchun ekin turi, taxminiy hajm va yetkazib berish manzilini yozing — assortiment va shartlar bo'yicha taklif tayyorlaymiz.",
      },
      ru: {
        title: "Поставки семян",
        heading: "Семена для фермеров и компаний — оптом",
        p1: "AGRO EXPORT GROUP поставляет семена оптом фермерским хозяйствам и компаниям. В каталоге — семена зерновых, овощных и технических культур.",
        p2: "Сорт, объём партии и срок поставки согласуются отдельно по каждому запросу.",
        list: ["Семена пшеницы, кукурузы, ячменя и хлопчатника", "Семена овощей: томат, лук, морковь", "Договорённость по объёму и сроку", "Практический совет при выборе"],
        p3: "Для заказа укажите культуру, примерный объём и адрес поставки — мы подготовим предложение по ассортименту и условиям.",
      },
      en: {
        title: "Seed supply",
        heading: "Seed for farmers and companies — wholesale",
        p1: "AGRO EXPORT GROUP supplies seed wholesale to farms and companies. The catalogue covers grain, vegetable and industrial crops.",
        p2: "Variety, lot size and delivery timing are agreed separately for each request.",
        list: ["Wheat, maize, barley and cotton seed", "Vegetable seed: tomato, onion, carrot", "Agreement on volume and timing", "Practical advice on choosing"],
        p3: "To order, tell us the crop, the approximate volume and the delivery address, and we will prepare an offer on range and terms.",
      },
    },
    {
      id: "galla",
      img: "assets/img/service/service-img-7.jpg",
      link: "shop.html?cat=galla",
      uz: {
        title: "Galla savdosi",
        heading: "Galla mahsulotlarining ulgurji savdosi",
        p1: "Kompaniyaning asosiy yo'nalishlaridan biri — galla mahsulotlarining ulgurji savdosi: bug'doy, arpa, makka, sholi, suli va javdar.",
        p2: "Partiya hajmi, sifat ko'rsatkichlari va yetkazib berish muddati so'rov asosida kelishiladi.",
        list: ["Bug'doy, arpa, makka", "Sholi, suli, javdar", "Ulgurji partiyalar", "Muddat va shartlar bo'yicha ochiq kelishuv"],
        p3: "So'rovda galla turi, kerakli hajm va yetkazib berish manzilini ko'rsating — narx va muddat bo'yicha taklif yuboramiz.",
      },
      ru: {
        title: "Торговля зерном",
        heading: "Оптовая торговля зерном",
        p1: "Одно из основных направлений компании — оптовая торговля зерном: пшеница, ячмень, кукуруза, рис, овёс и рожь.",
        p2: "Объём партии, показатели качества и срок поставки согласуются по запросу.",
        list: ["Пшеница, ячмень, кукуруза", "Рис, овёс, рожь", "Оптовые партии", "Открытая договорённость о сроках и условиях"],
        p3: "Укажите в запросе вид зерна, объём и адрес поставки — пришлём предложение по цене и сроку.",
      },
      en: {
        title: "Grain trade",
        heading: "Wholesale grain trade",
        p1: "One of the company's core lines is wholesale grain: wheat, barley, maize, rice, oats and rye.",
        p2: "Lot size, quality parameters and delivery timing are agreed on request.",
        list: ["Wheat, barley, maize", "Rice, oats, rye", "Wholesale lots", "Open agreement on timing and terms"],
        p3: "Include the grain type, volume and delivery address in your request, and we will send an offer on price and timing.",
      },
    },
    {
      id: "ozuqa",
      img: "assets/img/service/service-img-8.jpg",
      link: "shop.html?cat=ozuqa",
      uz: {
        title: "Hayvonlar uchun ozuqa",
        heading: "Chorvachilik uchun ozuqa mahsulotlari",
        p1: "Hayvonlar uchun ozuqalarning ulgurji savdosi — kompaniya faoliyatining asosiy yo'nalishlaridan biri. Katalogda chorva ozuqasi va aralash ozuqa bor.",
        p2: "Tarkib, qadoqlash va hajm har bir xo'jalik ehtiyojiga qarab so'rov asosida kelishiladi.",
        list: ["Chorva ozuqasi", "Aralash ozuqa", "Ulgurji hajmlar", "Muntazam buyurtmalar uchun hamkorlik"],
        p3: "So'rovda hayvon turi, kerakli hajm va yetkazib berish manzilini yozing — mos taklif tayyorlaymiz.",
      },
      ru: {
        title: "Корма для животных",
        heading: "Кормовая продукция для животноводства",
        p1: "Оптовая торговля кормами для животных — одно из основных направлений компании. В каталоге — корм для скота и комбикорм.",
        p2: "Состав, фасовка и объём согласуются по запросу с учётом потребностей хозяйства.",
        list: ["Корм для скота", "Комбикорм", "Оптовые объёмы", "Сотрудничество для регулярных заказов"],
        p3: "Укажите вид животных, объём и адрес поставки — подготовим подходящее предложение.",
      },
      en: {
        title: "Animal feed",
        heading: "Feed products for livestock",
        p1: "Wholesale animal feed is one of the company's core lines. The catalogue includes livestock feed and compound feed.",
        p2: "Composition, packaging and volume are agreed on request to fit each farm's needs.",
        list: ["Livestock feed", "Compound feed", "Wholesale volumes", "Partnership for regular orders"],
        p3: "Tell us the livestock type, volume and delivery address, and we will prepare a suitable offer.",
      },
    },
    {
      id: "yetkazish",
      img: "assets/img/service/service-img-6.jpg",
      link: "shop.html",
      uz: {
        title: "Buyurtma va yetkazish",
        heading: "So'rovdan yetkazib berishgacha — aniq tartib",
        p1: "Buyurtma to'rt bosqichda amalga oshadi: so'rov va ehtiyojni aniqlash, taklif va kelishuv, yetkazib berish hamda keyingi hamkorlik.",
        p2: "Mahsulot kelishilgan hajm va muddatda yetkaziladi.",
        list: ["Kerakli mahsulot turi va hajmini aniqlash", "Assortiment, muddat va shartlarni kelishish", "Kelishilgan hajmda yetkazib berish", "Keyingi buyurtmalarda qo'llab-quvvatlash"],
        p3: "Buyurtma berish uchun aloqa sahifasidagi formadan foydalaning yoki telefon orqali bog'laning.",
      },
      ru: {
        title: "Заказ и поставка",
        heading: "От запроса до поставки — понятный порядок",
        p1: "Заказ проходит четыре этапа: запрос и потребность, предложение и договорённость, поставка и дальнейшее сотрудничество.",
        p2: "Продукция поставляется в согласованном объёме и в согласованный срок.",
        list: ["Определяем вид продукции и объём", "Согласуем ассортимент, сроки и условия", "Поставляем в согласованном объёме", "Поддерживаем при следующих заказах"],
        p3: "Для заказа воспользуйтесь формой на странице контактов или позвоните нам.",
      },
      en: {
        title: "Order and delivery",
        heading: "From request to delivery — a clear process",
        p1: "An order goes through four steps: request and need, offer and agreement, delivery, and ongoing partnership.",
        p2: "Products are delivered in the agreed volume and on the agreed timeline.",
        list: ["Define the product type and volume", "Agree the range, timing and terms", "Deliver the agreed volume", "Support you on later orders"],
        p3: "To order, use the form on the contact page or call us.",
      },
    },
    {
      id: "maslahat",
      img: "assets/img/service/service-img-10.jpg",
      link: "agronomy.html",
      uz: {
        title: "Maslahat va qo'llab-quvvatlash",
        heading: "Mahsulot tanlashda amaliy maslahat",
        p1: "Qaysi urug', galla yoki ozuqa sizning vazifangizga mos kelishini aniqlashda yordam beramiz.",
        p2: "Savolingizni yozing yoki qo'ng'iroq qiling — mutaxassis siz bilan bog'lanadi.",
        list: ["Mahsulot turini tanlash", "Kerakli hajmni hisoblash", "Yetkazib berish muddatini rejalashtirish", "Takroriy buyurtmalar bo'yicha yordam"],
        p3: "Agronomiya bo'limida ekish va parvarish bo'yicha qisqa qo'llanmalar ham bor.",
      },
      ru: {
        title: "Консультация и поддержка",
        heading: "Практический совет при выборе продукции",
        p1: "Поможем определить, какие семена, зерно или корм подходят под вашу задачу.",
        p2: "Напишите вопрос или позвоните — специалист свяжется с вами.",
        list: ["Выбор вида продукции", "Расчёт нужного объёма", "Планирование срока поставки", "Помощь с повторными заказами"],
        p3: "В разделе «Агрономия» есть краткие руководства по посеву и уходу.",
      },
      en: {
        title: "Advice and support",
        heading: "Practical advice on choosing products",
        p1: "We help you work out which seed, grain or feed fits your task.",
        p2: "Send your question or call us, and a specialist will get back to you.",
        list: ["Choosing the product type", "Estimating the volume you need", "Planning delivery timing", "Help with repeat orders"],
        p3: "The Agronomy section also has short guides on sowing and care.",
      },
    },
  ];

  var UI = {
    uz: {
      featureTitle: "Asosiy jihatlar",
      request: "So'rov yuborish",
      related: "O'xshash mahsulotlar",
      details: "Batafsil",
      products: "Mahsulotlar",
      services: "Xizmatlar",
      otherServices: "Boshqa xizmatlar",
      viewProducts: "Mahsulotlarni ko'rish",
      requestPrefix: "So'rov: ",
    },
    ru: {
      featureTitle: "Главное",
      request: "Отправить запрос",
      related: "Похожие товары",
      details: "Подробнее",
      products: "Продукция",
      services: "Услуги",
      otherServices: "Другие услуги",
      viewProducts: "Смотреть продукцию",
      requestPrefix: "Запрос: ",
    },
    en: {
      featureTitle: "Key points",
      request: "Send request",
      related: "Similar products",
      details: "Details",
      products: "Products",
      services: "Services",
      otherServices: "Other services",
      viewProducts: "View products",
      requestPrefix: "Request: ",
    },
  };

  window.AEG_CATALOG = {
    categories: CATEGORIES,
    price: PRICE,
    features: FEATURES,
    lead: lead,
    order: ORDER,
    products: PRODUCTS,
    services: SERVICES,
    ui: UI,
  };
})();
