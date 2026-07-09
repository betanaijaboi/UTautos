export const DISCLAIMER_VERSION = "v1";

export const DISCLAIMER_SECTIONS = [
  {
    title: "Smart-glasses documentation",
    body: "For every appointment, your detailer wears Meta smart glasses to document the vehicle or aircraft's condition before and after service. This protects both you and UT Autos in the rare event of a dispute over pre-existing damage. You must start the engine (or auxiliary power unit, for jets) in view of this camera at the start of the appointment.",
  },
  {
    title: "Face blurring — your choice",
    body: "If you'd rather not appear on camera, turn on face blurring and any face that enters frame is automatically blurred in the recording, in real time. You can set this as your account default and override it per booking.",
  },
  {
    title: "What we do with the recording",
    body: "Footage is used solely for service documentation and dispute resolution. It is retained for 90 days and then permanently deleted, and is never sold or shared with third parties.",
  },
  {
    title: "Consent",
    body: "By checking the box below, you acknowledge and agree to this policy. You can review this disclaimer at any time from the footer of the site.",
  },
] as const;
