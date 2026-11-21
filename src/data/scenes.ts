/** Project illustrations: the field poster layouts and which one each project page shows. */

/** Which field poster illustrates each project (see src/components/field/targets.ts). */
export const projectField: Record<string, { state: FieldState; caption: string }> = {
  seagis: {
    state: "seagis",
    caption: "IoT readings and regional data aligned hour by hour",
  },
  hiroop: {
    state: "hiroop-classes",
    // CV: "predictions across five respiratory sound classes"
    caption: "Audio features separated into five respiratory sound classes",
  },
  emodu: {
    state: "emodu",
    // CV: "Evaluated the model on 112 test examples, improving BERTScore F1 from 0.6878 to 0.7238"
    caption: "112 evaluation examples; BERTScore F1 0.6878 to 0.7238",
  },
};

/** Field poster layouts (served as /field/<state>.svg). */
export const FIELD_STATES = ["seagis", "hiroop-classes", "emodu"] as const;
export type FieldState = (typeof FIELD_STATES)[number];
