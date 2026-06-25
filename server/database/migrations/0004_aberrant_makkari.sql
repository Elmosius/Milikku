CREATE TABLE "reminder_states" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"reminder_key" text NOT NULL,
	"read_at" timestamp,
	"dismissed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reminder_states" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "reminder_states" ADD CONSTRAINT "reminder_states_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "reminder_states_user_key_unique" ON "reminder_states" USING btree ("user_id","reminder_key");--> statement-breakpoint
CREATE POLICY "Users can view their own reminder states" ON "reminder_states" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "reminder_states"."user_id");--> statement-breakpoint
CREATE POLICY "Users can create their own reminder states" ON "reminder_states" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) is not null and (select auth.uid()) = "reminder_states"."user_id");--> statement-breakpoint
CREATE POLICY "Users can update their own reminder states" ON "reminder_states" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "reminder_states"."user_id") WITH CHECK ((select auth.uid()) is not null and (select auth.uid()) = "reminder_states"."user_id");--> statement-breakpoint
CREATE POLICY "Users can delete their own reminder states" ON "reminder_states" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) is not null and (select auth.uid()) = "reminder_states"."user_id");