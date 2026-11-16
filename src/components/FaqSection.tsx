import { FaqAccordion } from "@/components/FaqAccordion";
import { getTextsMap } from "@/lib/cms";
import { getFaqsForSite } from "@/lib/cms-faq";

type Props = {
  title?: string;
  subtitle?: string;
};

/** Server wrapper — loads dynamic FAQs + titles from CMS. */
export async function FaqSection({ title, subtitle }: Props) {
  const [items, texts] = await Promise.all([getFaqsForSite(), getTextsMap()]);
  return (
    <FaqAccordion
      items={items}
      title={title || texts.faq_title || "Frequently asked questions"}
      subtitle={subtitle || texts.faq_subtitle || "Straight answers before you book your trip."}
    />
  );
}
