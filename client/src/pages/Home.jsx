import BestSellers from "../components/BestSellers";
import Categories from "../components/Categories";
import {MainBanner} from "../components/MainBanner";
import ButtomBanner from "../components/ButtomBanner";
import NewsPaperSection from "../components/NewsPaperSection";

export default function Home() {
  return(
    <div className="mt-10">
      <MainBanner/>
      <Categories/>
      <BestSellers/>
      <ButtomBanner/>
      <NewsPaperSection/>
    </div>
  )
}