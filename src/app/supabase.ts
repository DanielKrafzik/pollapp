import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
 supabase = createClient('https://kbxmuqupovbproxzpdxz.supabase.co/rest/v1/', 'sb_publishable_O-oDpOY5VP1ox1WDp9-qTQ_IOSpHwsg')
}
