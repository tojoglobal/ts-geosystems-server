import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import adminRoute from "./routes/adminRoute.js";
import { EventEmitter } from "events";
import ProductsRoute from "./routes/productsRoute.js";
import categoryRoute from "./routes/categoryRoutes.js";
import brandsRoute from "./routes/brandsRoutes.js";
import SoftwareRoute from "./routes/SoftwareRoutes.js";
import HomePageControlRoute from "./routes/HomepageRoute.js";
import SSLCommerzPaymentRoute from "./routes/sslcommerz.js";
import ordersRoute from "./routes/ordersRoute.js";
import promoRoutes from "./routes/promoRoutes.js";
import TaxesRoutes from "./routes/taxesRoutes.js";
import serviceRoute from "./routes/serviceRoute.js";
import contactUsRoute from "./routes/contactUsRoute.js";
import hireRoute from "./routes/hireRoute.js";
import aboutUsRoute from "./routes/aboutUsRoute.js";
import userRoutes from "./routes/userRoutes.js";
import promo_product_banner_02 from "./routes/HomePageRoutes/promo_product_banner_02Routes.js";
import Feature_highlight_banner_03_left_01 from "./routes/HomePageRoutes/Feature_highlight_banner_03_left_01Routes.js";
import homepage_single_images from "./routes/HomePageRoutes/homepage-single-images-Routes.js";
import SlideRoutes from "./routes/HomePageRoutes/SlideRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";
import blogTypeRoutes from "./routes/blogTypeRoutes.js";
import BlogRoutes from "./routes/BlogRoutes.js";
import experienceCenterRoutes from "./routes/HomePageRoutes/experienceCenterRoutes.js";
import tradeInRoutes from "./routes/tradeInRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import UserManualsRoute from "./routes/userManualsRoutes.js";
import QuickGuidesRoute from "./routes/quickGuidesRoutes.js";
import emailRouter from "./routes/emailsRoutes.js";
import usedRoute from "./routes/usedRoute.js";
import homeRoute from "./routes/HomePageRoutes/homeRoute.js";
import footerRoute from "./routes/footerRoute.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
EventEmitter.defaultMaxListeners = 20;

// if handle your project file system use this
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const localhostPort1 = 5173;
const localhostPort2 = 5174;
const localhostPort3 = 3000;

const allowedOrigins = [
  `http://localhost:${localhostPort1}`,
  `http://localhost:${localhostPort2}`,
  `http://localhost:${localhostPort3}`,
  `https://tsgb.site`,
  `https://www.tsgb.site`,
  `https://admin.tsgb.site`, // ✅ add this
  `https://www.admin.tsgb.site`, // ✅ if you have www.admin also
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Router set up
app.use(adminRoute);
// product
app.use(ProductsRoute);
// category
app.use("/api", categoryRoute);
// brands
app.use("/api", brandsRoute);
// Software routes
app.use("/api", SoftwareRoute);
// UserManualsRoute routes
app.use("/api", UserManualsRoute);
// QuickGuidesRoute routes
app.use("/api", QuickGuidesRoute);
// ssl commer
app.use("/api", SSLCommerzPaymentRoute);
// order route
app.use("/api", ordersRoute);
// promo codes
app.use("/api", promoRoutes);
// taxes route
app.use("/api", TaxesRoutes);
// service route ..
app.use("/api", serviceRoute);
// contact route
app.use("/api", contactUsRoute);
// used benifit route
app.use("/api", usedRoute);
// hire route
app.use("/api", hireRoute);
// aboutUs route
app.use("/api", aboutUsRoute);
// Home page contoll
app.use("/api", HomePageControlRoute);
// user contoll
app.use("/api", userRoutes);
// Home page api
app.use("/api", promo_product_banner_02);
// Home page Feature_highlight_banner_03_left_01_image
app.use("/api", Feature_highlight_banner_03_left_01);
// Home page Feature_highlight_banner_03_left_01_image
app.use("/api", homepage_single_images);
app.use("/api", experienceCenterRoutes);
// home mainSlide
app.use("/api", SlideRoutes);
// author
app.use("/api", authorRoutes);
// blogTypeRoutes routes
app.use("/api", blogTypeRoutes);
// blog routs
app.use("/api", BlogRoutes);
// trad in api
app.use("/api", tradeInRoutes);
// support
app.use("/api", supportRoutes);
// home sent
app.use("/api", homeRoute);
// footer sent
app.use("/api", footerRoute);
// mail sent
app.use("/api/emails", emailRouter);

app.get("/", (req, res) => {
  return res.send(" <h1>Welcome to the TSGB Server Server</h1>");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running where http://localhost:${PORT}`);
});
