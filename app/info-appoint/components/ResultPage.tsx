'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Star } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import type { RecruitmentSchedule, SheetData } from "@/app/info-appoint/types";

interface ResultPageProps {
  selectedDate: string;
}

export default function ResultPage({ selectedDate }: ResultPageProps) {
  const router = useRouter();
  const [schedule, setSchedule] = useState<RecruitmentSchedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const basePath = process.env.__NEXT_ROUTER_BASEPATH || "";
    fetch(`${basePath}/data.json`)
      .then((res) => res.json())
      .then((data: SheetData) => {
        if (!data.schedules || data.schedules.length === 0) {
          setLoading(false);
          return;
        }

        const selectedDateObj = new Date(selectedDate);
        const normalizedSelectedDate = new Date(
          Date.UTC(
            selectedDateObj.getFullYear(),
            selectedDateObj.getMonth(),
            selectedDateObj.getDate()
          )
        );

        const candidates = data.calendarEvents.filter((event) => {
          const eventDate = new Date(event.date);
          const normalizedEventDate = new Date(
            Date.UTC(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())
          );

          const isCandidateContent =
            event.title.includes("?ê²©ì¶”ê?/?„ì‚°?¹ì¸ë§ˆê°") ||
            event.title.includes("?ê²©ì¶”ê?") ||
            event.title.includes("?„ì‚°?¹ì¸ë§ˆê°");

          return (
            normalizedEventDate.getTime() >= normalizedSelectedDate.getTime() &&
            event.type === "goodrich" &&
            isCandidateContent &&
            event.title.match(/(\d+)??\d+)ì°?)
          );
        });

        if (candidates.length === 0) {
          setSchedule(data.schedules[0] || null);
          setLoading(false);
          return;
        }

        candidates.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        const closestEvent = candidates[0];
        let foundSchedule = data.schedules[0];

        const roundMatch = closestEvent.title.match(/(\d+)??\d+)ì°?);
        if (roundMatch) {
          const month = roundMatch[1];
          const round = roundMatch[2];
          const targetRound = `${month}-${round}`;
          const matchedSchedule = data.schedules.find(
            (s) => s.round === targetRound || s.round === `${targetRound}ì°?
          );
          if (matchedSchedule) {
            foundSchedule = matchedSchedule;
          }
        }

        setSchedule(foundSchedule);
        setLoading(false);
      })
      .catch((err) => {
        console.error("?°ì´??ë¡œë“œ ?¤íŒ¨:", err);
        setLoading(false);
      });
  }, [selectedDate]);

  const handlePdfDownload = async () => {
    if (!schedule) return;
    const { jsPDF } = await import("jspdf");
    const html2canvas = (await import("html2canvas")).default;

    const element = document.getElementById("result-content");
    const container = element?.parentElement;
    if (!element || !container) return;

    const originalMaxWidth = container.style.maxWidth;
    const originalWidth = (container as HTMLElement).style.width;
    container.style.maxWidth = "1200px";
    (container as HTMLElement).style.width = "1200px";
    await new Promise((resolve) => setTimeout(resolve, 100));

    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      width: 1200,
    });

    container.style.maxWidth = originalMaxWidth;
    (container as HTMLElement).style.width = originalWidth;

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`?„ì´‰?¼ì •_${schedule.round}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-gray-600">?°ì´??ë¡œë”© ì¤?..</div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-red-600">?¼ì •??ì°¾ì„ ???†ìŠµ?ˆë‹¤.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div id="result-content">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
            ?„ì´‰?¼ì •:{schedule.round}ì°?{schedule.gpOpenDate})
          </h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                êµ¿ë¦¬ì¹??ë³´ì½”ë“œ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-semibold">?¼ì •: </span>
                <span>
                  {schedule.gpOpenDate} GP ?¤í”ˆ ?ˆì • ({schedule.gpOpenTime})
                </span>
              </div>
              <div className="text-orange-600 text-sm">
                *?í•´ë³´í—˜ ì½”ë“œ??GP-?¸ì‚¬?•ë³´?ì„œ ?•ì¸ ê°€??
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                ?ëª…ë³´í—˜???„ì´‰ ?¼ì •
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-orange-600 space-y-1 mb-4">
                <div>
                  * ?™ì–‘?ëª…/?¼ì´?˜ìƒëª??€ë¸Œë¼?´í”„?ëª…?€ ?„ì´‰ ???œì¶œ??ë³´í—˜???œë¥˜ë¡?
                  ì§„í–‰?©ë‹ˆ??(ë³„ë„ ?„ì´‰ ë¬¸ì/?Œë¦¼???†ìŒ)
                </div>
                <div>
                  * ì°¨ìˆ˜ë³??¼ì •?œì˜ ë³´í—˜???„ì´‰ ë§ˆê°???´í›„ D+1~2???´ë‚´???„ì´‰?ˆë‚´ê°€
                  ë¬¸ìÂ·?Œë¦¼?¡ìœ¼ë¡?ë°œì†¡?©ë‹ˆ??(?Œì‚¬ë³?ë°©ë²• ì°¸ê³ )
                </div>
                <div>
                  * ë¬¸ìÂ·?Œë¦¼?¡ì„ ?•ì¸?˜ì‹œê³??Œì‚¬ë³„ë¡œ ?„ì´‰ ì§„í–‰??ë°˜ë“œ????ì£¼ì…”??
                  ë³´í—˜??ì½”ë“œ ë°œê¸‰??ì§„í–‰?©ë‹ˆ??
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 w-[15%] min-w-[80px]">
                        ?Œì‚¬
                      </th>
                      <th className="border border-gray-300 p-2 w-[10%] min-w-[60px]">
                        ì°¨ìˆ˜
                      </th>
                      <th className="border border-gray-300 p-2 w-[15%] min-w-[90px]">
                        ?‘ìˆ˜ë§ˆê°??
                      </th>
                      <th className="border border-gray-300 p-2 w-[15%] min-w-[90px]">
                        GP?…ë¡œ??
                      </th>
                      <th className="border border-gray-300 p-2 w-[18%] min-w-[120px]">
                        ?„ì´‰ë°©ë²•
                      </th>
                      <th className="border border-gray-300 p-2 w-[27%] min-w-[180px]">
                        ?´ë‹¹??
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.companies.map((company, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-2">{company.company}</td>
                        <td className="border border-gray-300 p-2">{company.round}ì°?/td>
                        <td className="border border-gray-300 p-2">
                          {company.acceptanceDeadline}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {company.gpUploadDate}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {company.recruitmentMethod}
                        </td>
                        <td className="border border-gray-300 p-2">{company.manager}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-sm text-gray-600 mt-4 text-center md:text-right">
                * ì¢Œìš°ë¡??¤í¬ë¡?
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="gap-2" onClick={() => router.push("/info-appoint")}>
            <ArrowLeft className="h-4 w-4" />
            ?´ì „?¼ë¡œ
          </Button>
          <Button className="gap-2 bg-blue-500 hover:bg-blue-600" onClick={handlePdfDownload}>
            <Download className="h-4 w-4" />
            ?„ì´‰ì°¨ìˆ˜PDF?€??
          </Button>
        </div>
      </div>
    </div>
  );
}

