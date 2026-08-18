import { useState } from 'react'
import BackButton from '../../components/ui/BackButton'

const TOTAL_STEPS = 10

const inputCls =
  'w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none focus:border-tov-red focus:bg-white'

const labelCls = 'mt-3 block text-xs font-semibold text-stone-500'

function Check({ children, className }) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-600 ${className}`}
    >
      {children}
    </label>
  )
}

const steps = [
  {
    title: 'Identity',
    content: (
      <>
        <h3 className="text-base font-bold text-stone-800">Step 1 of 10: Identity</h3>
        <label htmlFor="reg_name" className={labelCls}>Full Name / Artistic Alias *</label>
        <input id="reg_name" type="text" placeholder="e.g. Tongai Makawa aka Outspoken" className={inputCls} />
        <label htmlFor="reg_age" className={labelCls}>Age</label>
        <input id="reg_age" type="number" placeholder="Your age" min="13" max="120" className={inputCls} />
        <label htmlFor="reg_gender" className={labelCls}>Gender</label>
        <select id="reg_gender" className={inputCls}>
          <option value="">Prefer not to say</option>
          <option>Male</option>
          <option>Female</option>
          <option>Non-binary</option>
          <option>Other</option>
        </select>
      </>
    ),
  },
  {
    title: 'Contact',
    content: (
      <>
        <h3 className="text-base font-bold text-stone-800">Step 2 of 10: Contact</h3>
        <label htmlFor="reg_email" className={labelCls}>Email Address *</label>
        <input id="reg_email" type="email" placeholder="you@example.com" className={inputCls} />
        <label htmlFor="reg_phone" className={labelCls}>Phone Number (WhatsApp preferred)</label>
        <input id="reg_phone" type="tel" placeholder="+263..." className={inputCls} />
        <label htmlFor="reg_region" className={labelCls}>Region / Town or City of Operation *</label>
        <input id="reg_region" type="text" placeholder="e.g. Harare, Bulawayo, Chitungwiza" className={inputCls} />
      </>
    ),
  },
  {
    title: 'Social Media Links',
    content: (
      <>
        <h3 className="text-base font-bold text-stone-800">Step 3 of 10: Social Media Links</h3>
        <label htmlFor="reg_insta" className={labelCls}>Instagram</label>
        <input id="reg_insta" type="text" placeholder="@yourhandle" className={inputCls} />
        <label htmlFor="reg_twitter" className={labelCls}>Twitter / X</label>
        <input id="reg_twitter" type="text" placeholder="@yourhandle" className={inputCls} />
        <label htmlFor="reg_youtube" className={labelCls}>YouTube Channel</label>
        <input id="reg_youtube" type="text" placeholder="Channel URL" className={inputCls} />
        <label htmlFor="reg_fb" className={labelCls}>Facebook</label>
        <input id="reg_fb" type="text" placeholder="Profile or Page URL" className={inputCls} />
        <label htmlFor="reg_website" className={labelCls}>Personal Website / Portfolio</label>
        <input id="reg_website" type="text" placeholder="https://..." className={inputCls} />
      </>
    ),
  },
  {
    title: 'Tactical Profile',
    content: (
      <>
        <h3 className="text-base font-bold text-stone-800">Step 4 of 10: Tactical Profile</h3>
        <label htmlFor="reg_field" className={labelCls}>Primary Creative Field *</label>
        <select id="reg_field" className={inputCls}>
          <option value="">Select...</option>
          <option>Visual Arts & Sculpture</option>
          <option>Theatre & Spoken Word</option>
          <option>Literature & Print</option>
          <option>Film & Digital Satire</option>
          <option>Music & Audio</option>
          <option>Multi-Disciplinary</option>
        </select>
        <p className="mt-3 text-xs font-semibold text-stone-500">Systemic Trap(s) You Counter</p>
        <div className="mt-1 grid gap-1.5">
          <Check><input type="checkbox" value="anti-drug" className="reg-trap" /> Anti-Drug (Substance Abuse)</Check>
          <Check><input type="checkbox" value="anti-hopeium" className="reg-trap" /> Anti-Hopeium (Civic Apathy)</Check>
          <Check><input type="checkbox" value="attention" className="reg-trap" /> Attention Reset (Short-Form Addiction)</Check>
        </div>
        <label htmlFor="reg_tactical" className={labelCls}>Tactical Contribution Summary (Max 250 words)</label>
        <textarea id="reg_tactical" placeholder="Describe how your work de-conditions the public..." maxLength="1500" className={`${inputCls} min-h-20 resize-y`} />
      </>
    ),
  },
  {
    title: 'Portfolio',
    content: (
      <>
        <h3 className="text-base font-bold text-stone-800">Step 5 of 10: Portfolio</h3>
        <label htmlFor="reg_portfolio" className={labelCls}>Upload Portfolio Sample (Image/PDF/Audio, Max 15MB)</label>
        <input id="reg_portfolio" type="file" accept="image/*,.pdf,audio/*" className={inputCls} />
        <p className="mt-1 text-[11px] text-stone-400">Accepted: images, PDFs, audio snippets</p>
        <label htmlFor="reg_gallery" className={labelCls}>Gallery Images (up to 5)</label>
        <input id="reg_gallery" type="file" accept="image/*" multiple className={inputCls} />
        <p className="mt-1 text-[11px] text-stone-400">Select multiple images for your gallery</p>
      </>
    ),
  },
  {
    title: 'Cross-Sector Ecosystem',
    content: (
      <>
        <h3 className="text-base font-bold text-stone-800">Step 6 of 10: Cross-Sector Ecosystem</h3>
        <p className="mt-3 text-xs font-semibold text-stone-500">Partner Sector Integrations</p>
        <div className="mt-1 grid gap-1.5">
          <Check><input type="checkbox" value="gov-health" className="reg-partner" /> Government Health Officials</Check>
          <Check><input type="checkbox" value="rehab" className="reg-partner" /> Rehabilitation Practitioners</Check>
          <Check><input type="checkbox" value="civil-society" className="reg-partner" /> Civil Society Groups</Check>
          <Check><input type="checkbox" value="academic" className="reg-partner" /> Academic / University Institutions</Check>
          <Check><input type="checkbox" value="independent-media" className="reg-partner" /> Independent Media Networks</Check>
        </div>
        <p className="mt-3 text-xs font-semibold text-stone-500">Support Pathways Offered</p>
        <div className="mt-1 grid gap-1.5">
          <Check><input type="checkbox" value="face-to-face" className="reg-support" /> Face-to-Face Psychological Support</Check>
          <Check><input type="checkbox" value="rehab-referral" className="reg-support" /> Direct Rehab Referrals</Check>
          <Check><input type="checkbox" value="media-literacy" className="reg-support" /> Media Literacy Workshops</Check>
          <Check><input type="checkbox" value="counseling" className="reg-support" /> Mental Health Counseling</Check>
        </div>
        <label htmlFor="reg_partner_orgs" className={labelCls}>Partner Organization Names</label>
        <input id="reg_partner_orgs" type="text" placeholder="e.g. University of Zimbabwe, Shoko Festival" className={inputCls} />
      </>
    ),
  },
  {
    title: 'Materials & Language',
    content: (
      <>
        <h3 className="text-base font-bold text-stone-800">Step 7 of 10: Materials & Language</h3>
        <p className="mt-3 text-xs font-semibold text-stone-500">Physical Materials / Mediums Used</p>
        <div className="mt-1 grid gap-1.5">
          <Check><input type="checkbox" value="recycled-bottles" className="reg-material" /> Recycled Drug/Pill Bottles & Waste</Check>
          <Check><input type="checkbox" value="e-waste" className="reg-material" /> E-Waste & Computer Components</Check>
          <Check><input type="checkbox" value="scrap-wire" className="reg-material" /> Scrap Wire & Urban Junk</Check>
          <Check><input type="checkbox" value="stone-sculpture" className="reg-material" /> Traditional Stone Sculpture</Check>
          <Check><input type="checkbox" value="murals" className="reg-material" /> Physical Wall Paint & Murals</Check>
          <Check><input type="checkbox" value="acoustic" className="reg-material" /> Acoustic / Traditional Instruments</Check>
        </div>
        <p className="mt-3 text-xs font-semibold text-stone-500">Linguistic & Lyrical Style</p>
        <div className="mt-1 grid gap-1.5">
          <Check><input type="checkbox" value="deep-shona" className="reg-lingo" /> Deep Vernacular Shona (Chinyakare)</Check>
          <Check><input type="checkbox" value="street-slang" className="reg-lingo" /> High-Density Street Slang</Check>
          <Check><input type="checkbox" value="allegory" className="reg-lingo" /> Intricate Storytelling & Allegory</Check>
          <Check><input type="checkbox" value="raw-rhymes" className="reg-lingo" /> Raw Vernacular Rhymes</Check>
        </div>
        <p className="mt-3 text-xs font-semibold text-stone-500">Format Structure</p>
        <div className="mt-1 grid gap-1.5">
          <Check><input type="radio" name="reg_format" value="short-skit" /> Short-Form Satire / Skit</Check>
          <Check><input type="radio" name="reg_format" value="high-audio" /> High-Production Audio</Check>
          <Check><input type="radio" name="reg_format" value="long-lit" /> Long-Form Linear Literature / Zine</Check>
          <Check><input type="radio" name="reg_format" value="live-stage" /> Live Somatic Stage Play / Slam</Check>
        </div>
      </>
    ),
  },
  {
    title: 'Generational Tier',
    content: (
      <>
        <h3 className="text-base font-bold text-stone-800">Step 8 of 10: Generational Tier</h3>
        <p className="mt-3 text-xs font-semibold text-stone-500">Career Stage / Legacy Level</p>
        <div className="mt-1 grid gap-1.5">
          <Check><input type="radio" name="reg_legacy" value="youth" /> Youth-Led / Grassroots Activist</Check>
          <Check><input type="radio" name="reg_legacy" value="established" /> Established Sector Icon</Check>
          <Check><input type="radio" name="reg_legacy" value="legend" /> Yesteryear / Historic Legend</Check>
        </div>
        <p className="mt-3 text-xs font-semibold text-stone-500">Collaboration Readiness</p>
        <div className="mt-1 grid gap-1.5">
          <Check><input type="checkbox" value="mass-anthem" className="reg-collab" /> Mass Anti-Drug Anthem Collaborations</Check>
          <Check><input type="checkbox" value="cross-gen" className="reg-collab" /> Cross-Generational Projects</Check>
          <Check><input type="checkbox" value="mural-jams" className="reg-collab" /> Public Mural Art Jams</Check>
          <Check><input type="checkbox" value="uni-tours" className="reg-collab" /> University & Community Tour Hubs</Check>
        </div>
      </>
    ),
  },
  {
    title: 'Venue Infrastructure',
    content: (
      <>
        <h3 className="text-base font-bold text-stone-800">Step 9 of 10: Venue Infrastructure</h3>
        <p className="mt-3 text-xs font-semibold text-stone-500">Primary Physical Activation Venue Type</p>
        <div className="mt-1 grid gap-1.5">
          <Check><input type="checkbox" value="township-walls" className="reg-venue" /> Township Buildings & Walls</Check>
          <Check><input type="checkbox" value="shopping-centres" className="reg-venue" /> Local Shopping Centres</Check>
          <Check><input type="checkbox" value="beer-halls" className="reg-venue" /> Beer Halls & Ghetto Hotspots</Check>
          <Check><input type="checkbox" value="campuses" className="reg-venue" /> University / School Campuses</Check>
          <Check><input type="checkbox" value="theatre-spaces" className="reg-venue" /> Independent Theatre Spaces</Check>
          <Check><input type="checkbox" value="community-halls" className="reg-venue" /> Community Halls & Underground Festivals</Check>
        </div>
        <label htmlFor="reg_access" className={labelCls}>Physical Access Model</label>
        <select id="reg_access" className={inputCls}>
          <option value="">Select...</option>
          <option>Free Permanent Public Display</option>
          <option>Free Community Access Event</option>
          <option>Ticketed Independent Showcase</option>
          <option>Underground / Pop-Up Showcase</option>
        </select>
      </>
    ),
  },
  {
    title: 'Verification',
    content: (
      <>
        <h3 className="text-base font-bold text-stone-800">Step 10 of 10: Verification & Proof</h3>
        <label htmlFor="reg_proof" className={labelCls}>Proof of Physical Artwork / Event (Max 15MB) *</label>
        <input id="reg_proof" type="file" accept="image/*,.pdf,audio/*" className={inputCls} />
        <p className="mt-1 text-[11px] text-stone-400">Upload a photo of your mural, audio sample, script snippet, or event poster.</p>
        <label htmlFor="reg_vouch" className={labelCls}>Peer / Collective Vouching Reference</label>
        <input id="reg_vouch" type="text" placeholder="Name and contact of recognized collective, festival, or lead artist" className={inputCls} />
        <label htmlFor="reg_impact" className={labelCls}>Public Impact Summary (Max 250 words) *</label>
        <textarea id="reg_impact" placeholder="Briefly outline the physical community impact achieved by your work to date..." maxLength="1500" className={`${inputCls} min-h-20 resize-y`} />
      </>
    ),
  },
]

export default function ContributorRegister() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    const name = document.getElementById('reg_name')?.value || 'Unnamed'
    const email = document.getElementById('reg_email')?.value || ''
    setSubmitted({ name, email })
    window.scrollTo(0, 0)
  }

  return (
    <div data-page="Contributor_Register" aria-label="Register as Creative Contributor" className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-tov-red to-red-700 p-6 text-white shadow-sm">
        <h1 className="text-2xl font-bold">Register as Creative Contributor</h1>
        <p className="mt-2 text-sm text-white/85">Join the Aweh Ekse! Unvertising movement.</p>
      </div>

      {submitted ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-4xl">✅</p>
          <h2 className="mt-2 text-lg font-bold text-stone-800">Registration submitted for {submitted.name}!</h2>
          <p className="mt-1 text-sm text-stone-500">
            {submitted.email ? `A confirmation will go to ${submitted.email}. ` : ''}
            Your profile will be reviewed and activated within 48 hours.
          </p>
          <p className="mt-3 text-xs italic text-stone-400">
            "Drugs cost money. Addiction is an expensive tax on the poor." – Aweh Ekse! Unvertising Campaign
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-4 flex justify-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full transition-colors ${i < step ? 'bg-tov-red' : 'bg-stone-200'}`}
              />
            ))}
          </div>

          {steps.map((s, i) => (
            <div key={s.title} className={i + 1 === step ? 'block' : 'hidden'}>
              {s.content}
            </div>
          ))}

          <div className="mt-5 flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep(s => Math.max(1, s - 1))}
              className="rounded-full bg-stone-100 px-5 py-2.5 text-sm font-bold text-stone-500 transition-colors hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={() => setStep(s => Math.min(TOTAL_STEPS, s + 1))}
                className="rounded-full bg-tov-blue px-6 py-2.5 text-sm font-bold text-white"
              >
                Next →
              </button>
            ) : (
              <button type="submit" className="rounded-full bg-tov-red px-6 py-2.5 text-sm font-bold text-white">
                ✅ Submit Registration
              </button>
            )}
          </div>
        </form>
      )}

      <BackButton to="/aweh/contributors" label="Back to Contributors" />
    </div>
  )
}
