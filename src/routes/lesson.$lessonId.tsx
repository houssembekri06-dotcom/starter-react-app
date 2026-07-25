import { createFileRoute } from "@tanstack/react-router";
// @ts-ignore js module
import Lesson from "../screens/Lesson";
import { Gate } from "../lib/gate";

export const Route = createFileRoute("/lesson/$lessonId")({
  component: () => (
    <Gate>
      <Lesson />
    </Gate>
  ),
  head: () => ({ meta: [{ title: "Lesson" }] }),
});