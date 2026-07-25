import { createFileRoute } from "@tanstack/react-router";
// @ts-ignore js module
import Quiz from "../screens/Quiz";
import { Gate } from "../lib/gate";

export const Route = createFileRoute("/lesson/$lessonId_/quiz")({
  component: () => (
    <Gate>
      <Quiz />
    </Gate>
  ),
  head: () => ({ meta: [{ title: "Quiz" }] }),
});