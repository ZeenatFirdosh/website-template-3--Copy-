// biome-ignore-all lint: sentry auto-generated file
import { addIntegration, replayIntegration } from "@sentry/nextjs";

addIntegration(replayIntegration());
