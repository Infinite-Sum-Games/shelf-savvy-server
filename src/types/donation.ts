import z from "zod";

export const VstartDonation = z.object({
    senderId: z.string().trim().cuid(),
    receiverId: z.string().trim().cuid(),
    content: z.string().min(1),
})