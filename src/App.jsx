import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { OfflineProvider } from './context/OfflineContext'
import { ProfileProvider } from './context/ProfileContext'
import { SyncProvider } from './context/SyncContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { ToastProvider } from './components/ui/Toast'
import { RegionProvider } from './context/RegionContext'
import ErrorBoundary from './components/ErrorBoundary'
import AppShell from './components/layout/AppShell'
import { SkeletonList } from './components/ui/Skeleton'

const InsightsHome = lazy(() => import('./pages/Insights/InsightsHome'))
const InsightsCalendar = lazy(() => import('./pages/Insights/InsightsCalendar'))
const ContentDetail = lazy(() => import('./pages/Insights/ContentDetail'))
const DidYouKnowList = lazy(() => import('./pages/Insights/DidYouKnowList'))
const DidYouKnowDetail = lazy(() => import('./pages/Insights/DidYouKnowDetail'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const RegionSelect = lazy(() => import('./pages/RegionSelect'))

const AwehEkseHome = lazy(() => import('./pages/AwehEkse/AwehEkseHome'))
const AwehEkseContent = lazy(() => import('./pages/AwehEkse/AwehEkseContent'))
const AwehEkseLibrary = lazy(() => import('./pages/AwehEkse/AwehEkseLibrary'))
const LibraryCategory = lazy(() => import('./pages/AwehEkse/LibraryCategory'))
const LibraryDetail = lazy(() => import('./pages/AwehEkse/LibraryDetail'))
const Dictionary = lazy(() => import('./pages/AwehEkse/Dictionary'))
const AwehEkseRehab = lazy(() => import('./pages/AwehEkse/AwehEkseRehab'))
const Laws = lazy(() => import('./pages/AwehEkse/Laws'))
const Wellness = lazy(() => import('./pages/AwehEkse/Wellness'))
const WellnessFacility = lazy(() => import('./pages/AwehEkse/WellnessFacility'))
const HelpHome = lazy(() => import('./pages/AwehEkse/HelpHome'))
const HelpWizard = lazy(() => import('./pages/AwehEkse/HelpWizard'))
const CreativeContributors = lazy(() => import('./pages/AwehEkse/CreativeContributors'))
const ArtistProfile = lazy(() => import('./pages/AwehEkse/ArtistProfile'))
const ContributorRegister = lazy(() => import('./pages/AwehEkse/ContributorRegister'))

const ActivitiesHome = lazy(() => import('./pages/Activities/ActivitiesHome'))
const FactFiction = lazy(() => import('./pages/Activities/FactFiction'))
const MemoryGame = lazy(() => import('./pages/Activities/MemoryGame'))
const MusicMatch = lazy(() => import('./pages/Activities/MusicMatch'))
const StreetNameQuiz = lazy(() => import('./pages/Activities/StreetNameQuiz'))
const MatchWord = lazy(() => import('./pages/Activities/MatchWord'))
const TermBuilder = lazy(() => import('./pages/Activities/TermBuilder'))
const TheVerdict = lazy(() => import('./pages/Activities/TheVerdict'))

const ProfileHome = lazy(() => import('./pages/Profile/ProfileHome'))
const EventPlanner = lazy(() => import('./pages/Profile/EventPlanner'))
const OrganiseActivities = lazy(() => import('./pages/Profile/OrganiseActivities'))
const Framed = lazy(() => import('./pages/Profile/Framed'))
const MenuHome = lazy(() => import('./pages/Menu/MenuHome'))
const MenuContent = lazy(() => import('./pages/Menu/MenuContent'))
const Participants = lazy(() => import('./pages/Menu/Participants'))
const ParticipantPlaceholder = lazy(() => import('./pages/Menu/ParticipantPlaceholder'))
const Settings = lazy(() => import('./pages/Menu/Settings'))

const ProfileSelect = lazy(() => import('./pages/Profile/ProfileSelect'))
const ProfileCreate = lazy(() => import('./pages/Profile/ProfileCreate'))

const HubHome = lazy(() => import('./pages/InformationHub/HubHome'))
const CategoryView = lazy(() => import('./pages/InformationHub/CategoryView'))
const ArticlePage = lazy(() => import('./pages/InformationHub/ArticlePage'))
const SearchResults = lazy(() => import('./pages/InformationHub/SearchResults'))
const Bookmarks = lazy(() => import('./pages/InformationHub/Bookmarks'))
const SubstanceLibrary = lazy(() => import('./pages/InformationHub/SubstanceLibrary'))

const CheckerHome = lazy(() => import('./pages/RiskChecker/CheckerHome'))
const QuestionFlow = lazy(() => import('./pages/RiskChecker/QuestionFlow'))
const ResultsPage = lazy(() => import('./pages/RiskChecker/ResultsPage'))
const RiskHistory = lazy(() => import('./pages/RiskChecker/History'))

const DirectoryHome = lazy(() => import('./pages/ContactDirectory/DirectoryHome'))
const FacilityPage = lazy(() => import('./pages/ContactDirectory/FacilityPage'))
const Hotlines = lazy(() => import('./pages/ContactDirectory/Hotlines'))
const RehabDirectory = lazy(() => import('./pages/ContactDirectory/RehabDirectory'))
const RehabChecker = lazy(() => import('./pages/ContactDirectory/RehabChecker'))
const ProfessionalsDirectory = lazy(() => import('./pages/ContactDirectory/ProfessionalsDirectory'))
const EmergencyRouting = lazy(() => import('./pages/ContactDirectory/EmergencyRouting'))

const PlanLibrary = lazy(() => import('./pages/LessonPlans/PlanLibrary'))
const PlanViewer = lazy(() => import('./pages/LessonPlans/PlanViewer'))
const EducatorDashboard = lazy(() => import('./pages/LessonPlans/EducatorDashboard'))
const FacilitationGuide = lazy(() => import('./pages/LessonPlans/FacilitationGuide'))
const PostLessonReflection = lazy(() => import('./pages/LessonPlans/PostLessonReflection'))

const SafetyPlanHome = lazy(() => import('./pages/SafetyPlan/SafetyPlanHome'))
const PlanBuilder = lazy(() => import('./pages/SafetyPlan/PlanBuilder'))
const PlanView = lazy(() => import('./pages/SafetyPlan/PlanView'))
const SOSConfig = lazy(() => import('./pages/SafetyPlan/SOSConfig'))

const DailyCheckin = lazy(() => import('./pages/MoodTracker/DailyCheckin'))
const Heatmap = lazy(() => import('./pages/MoodTracker/Heatmap'))
const Insights = lazy(() => import('./pages/MoodTracker/Insights'))
const JournalEntry = lazy(() => import('./pages/MoodTracker/JournalEntry'))
const MoodJournal = lazy(() => import('./pages/MoodTracker/MoodJournal'))
const RecoveryDiary = lazy(() => import('./pages/MoodTracker/RecoveryDiary'))
const RecoveryGuide = lazy(() => import('./pages/MoodTracker/RecoveryGuide'))

const PollHome = lazy(() => import('./pages/Polls/PollHome'))
const HabitLedger = lazy(() => import('./pages/Polls/HabitLedger'))
const PollParticipate = lazy(() => import('./pages/Polls/PollParticipate'))
const PollResults = lazy(() => import('./pages/Polls/PollResults'))
const PollBuilder = lazy(() => import('./pages/Polls/PollBuilder'))

const CampaignHome = lazy(() => import('./pages/Campaign/CampaignHome'))
const CampaignBuilder = lazy(() => import('./pages/Campaign/CampaignBuilder'))
const CampaignCalendar = lazy(() => import('./pages/Campaign/CampaignCalendar'))
const CampaignMaterials = lazy(() => import('./pages/Campaign/CampaignMaterials'))
const AttendanceTracker = lazy(() => import('./pages/Campaign/AttendanceTracker'))
const CampaignReport = lazy(() => import('./pages/Campaign/CampaignReport'))
const AwehEkseHub = lazy(() => import('./pages/Campaign/AwehEkseHub'))

const ResearchPortal = lazy(() => import('./pages/Research/ResearchPortal'))
const SurveyBuilder = lazy(() => import('./pages/Research/SurveyBuilder'))
const SurveyTaker = lazy(() => import('./pages/Research/SurveyTaker'))
const SchoolDashboard = lazy(() => import('./pages/Research/SchoolDashboard'))
const DataExport = lazy(() => import('./pages/Research/DataExport'))

const GamesHome = lazy(() => import('./pages/Games/GamesHome'))
const SyncCodeLobby = lazy(() => import('./pages/Games/SyncCodeLobby'))
const CKNHome = lazy(() => import('./pages/Games/CKNHome'))
const CKNSolo = lazy(() => import('./pages/Games/CKNSolo'))
const CKNNulti = lazy(() => import('./pages/Games/CKNNulti'))
const CKNPaper = lazy(() => import('./pages/Games/CKNPaper'))
const KUHome = lazy(() => import('./pages/Games/KUHome'))
const KUSolo = lazy(() => import('./pages/Games/KUSolo'))
const KUMulti = lazy(() => import('./pages/Games/KUMulti'))
const KUPaper = lazy(() => import('./pages/Games/KUPaper'))
const BCHome = lazy(() => import('./pages/Games/BCHome'))
const BCSolo = lazy(() => import('./pages/Games/BCSolo'))
const BCMulti = lazy(() => import('./pages/Games/BCMulti'))
const BCPaper = lazy(() => import('./pages/Games/BCPaper'))

const AchievementsHome = lazy(() => import('./pages/Achievements/AchievementsHome'))
const BadgeDetail = lazy(() => import('./pages/Achievements/BadgeDetail'))
const More = lazy(() => import('./pages/More'))

function Loading() {
  return (
    <div className="p-6">
      <SkeletonList count={3} />
    </div>
  )
}

const routerBasename = import.meta.env.BASE_URL && import.meta.env.BASE_URL !== './'
  ? import.meta.env.BASE_URL.replace(/\/$/, '')
  : undefined

export default function App() {
  return (
    <ErrorBoundary>
      <OfflineProvider>
        <ProfileProvider>
          <SyncProvider>
            <ToastProvider>
              <FavoritesProvider>
                <RegionProvider>
                <BrowserRouter basename={routerBasename}>
                  <Suspense fallback={<Loading />}>
                    <Routes>
                      <Route element={<AppShell />}>
                        <Route path="/" element={<InsightsHome />} />
                        <Route path="/insights/calendar" element={<InsightsCalendar />} />
                        <Route path="/insights/did-you-know" element={<DidYouKnowList />} />
                        <Route path="/insights/did-you-know/:id" element={<DidYouKnowDetail />} />
                        <Route path="/insights/item/:id" element={<ContentDetail />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/region" element={<RegionSelect />} />

                        <Route path="/aweh" element={<AwehEkseHome />} />
                        <Route path="/aweh/contributors" element={<CreativeContributors />} />
                        <Route path="/aweh/contributors/register" element={<ContributorRegister />} />
                        <Route path="/aweh/contributors/:id" element={<ArtistProfile />} />
                        <Route path="/aweh/:slug" element={<AwehEkseContent />} />
                        <Route path="/aweh/library" element={<AwehEkseLibrary />} />
                        <Route path="/aweh/library/substances" element={<LibraryCategory />} />
                        <Route path="/aweh/library/substances/:id" element={<LibraryDetail />} />
                        <Route path="/aweh/library/conditioning" element={<LibraryCategory />} />
                        <Route path="/aweh/library/conditioning/:id" element={<LibraryDetail />} />
                        <Route path="/aweh/library/mental-health" element={<LibraryCategory />} />
                        <Route path="/aweh/library/mental-health/:id" element={<LibraryDetail />} />
                        <Route path="/aweh/library/rehabs" element={<AwehEkseRehab />} />
                        <Route path="/aweh/library/laws" element={<Laws />} />
                        <Route path="/aweh/library/dictionary" element={<Dictionary />} />
                        <Route path="/aweh/wellness" element={<Wellness />} />
                        <Route path="/aweh/wellness/facility/:id" element={<WellnessFacility />} />
                        <Route path="/aweh/polls" element={<PollHome />} />
                        <Route path="/aweh/help" element={<HelpHome />} />
                        <Route path="/aweh/help/wizard" element={<HelpWizard />} />

                        <Route path="/activities" element={<ActivitiesHome />} />
                        <Route path="/activities/fact-fiction" element={<FactFiction />} />
                        <Route path="/activities/memory" element={<MemoryGame />} />
                        <Route path="/activities/music-match" element={<MusicMatch />} />
                        <Route path="/activities/street-name-quiz" element={<StreetNameQuiz />} />
                        <Route path="/activities/match-word" element={<MatchWord />} />
                        <Route path="/activities/term-builder" element={<TermBuilder />} />
                        <Route path="/activities/the-verdict" element={<TheVerdict />} />

                        <Route path="/profile" element={<ProfileHome />} />
                        <Route path="/profile/bonding" element={<OrganiseActivities type="bonding" />} />
                        <Route path="/profile/obstacle-course" element={<OrganiseActivities type="obstacle-course" />} />
                        <Route path="/profile/event-planner" element={<EventPlanner />} />
                        <Route path="/profile/framed" element={<Framed />} />

                        <Route path="/menu" element={<MenuHome />} />
                        <Route path="/menu/:slug" element={<MenuContent />} />
                        <Route path="/menu/participants" element={<Participants />} />
                        <Route path="/menu/participants/rehabs" element={<RehabDirectory backTo="/menu/participants" />} />
                        <Route path="/menu/participants/professionals" element={<ProfessionalsDirectory backTo="/menu/participants" />} />
                        <Route path="/menu/participants/donors" element={<ParticipantPlaceholder title="Donors" desc="Funding partners" />} />
                        <Route path="/menu/participants/communities" element={<ParticipantPlaceholder title="Communities" desc="Community groups" />} />
                        <Route path="/menu/participants/education" element={<ParticipantPlaceholder title="Education" desc="Schools & colleges" />} />
                        <Route path="/menu/participants/religious" element={<ParticipantPlaceholder title="Religious" desc="Faith communities" />} />
                        <Route path="/menu/settings" element={<Settings />} />

                        <Route path="/profile/select" element={<ProfileSelect />} />
                        <Route path="/profile/create" element={<ProfileCreate />} />

                        <Route path="/hub" element={<HubHome />} />
                        <Route path="/hub/category/:category" element={<CategoryView />} />
                        <Route path="/hub/article/:id" element={<ArticlePage />} />
                        <Route path="/hub/search" element={<SearchResults />} />
                        <Route path="/hub/bookmarks" element={<Bookmarks />} />
                        <Route path="/hub/substances" element={<SubstanceLibrary />} />

                        <Route path="/check" element={<CheckerHome />} />
                        <Route path="/check/take/:type" element={<QuestionFlow />} />
                        <Route path="/check/results/:id" element={<ResultsPage />} />
                        <Route path="/check/history" element={<RiskHistory />} />

                        <Route path="/help" element={<DirectoryHome />} />
                        <Route path="/help/facility/:id" element={<FacilityPage />} />
                        <Route path="/help/hotlines" element={<Hotlines />} />
                        <Route path="/help/rehab" element={<RehabDirectory />} />
                        <Route path="/help/rehab/checker" element={<RehabChecker />} />
                        <Route path="/help/professionals" element={<ProfessionalsDirectory />} />
                        <Route path="/help/nearby" element={<EmergencyRouting />} />

                        <Route path="/lessons" element={<PlanLibrary />} />
                        <Route path="/lessons/:id" element={<PlanViewer />} />
                        <Route path="/lessons/dashboard" element={<EducatorDashboard />} />
                        <Route path="/lessons/facilitation" element={<FacilitationGuide />} />
                        <Route path="/lessons/reflect" element={<PostLessonReflection />} />

                        <Route path="/safety-plan" element={<SafetyPlanHome />} />
                        <Route path="/safety-plan/build" element={<PlanBuilder />} />
                        <Route path="/safety-plan/view" element={<PlanView />} />
                        <Route path="/safety-plan/sos" element={<SOSConfig />} />

                        <Route path="/mood" element={<MoodJournal />} />
                        <Route path="/mood/checkin" element={<DailyCheckin />} />
                        <Route path="/mood/diary" element={<RecoveryDiary />} />
                        <Route path="/mood/guide" element={<RecoveryGuide />} />
                        <Route path="/mood/heatmap" element={<Heatmap />} />
                        <Route path="/mood/insights" element={<Insights />} />
                        <Route path="/mood/journal" element={<JournalEntry />} />

                        <Route path="/polls" element={<PollHome />} />
                        <Route path="/polls/ledger" element={<HabitLedger />} />
                        <Route path="/polls/participate" element={<PollParticipate />} />
                        <Route path="/polls/results" element={<PollResults />} />
                        <Route path="/polls/create" element={<PollBuilder />} />

                        <Route path="/campaign" element={<CampaignHome />} />
                        <Route path="/campaign/build" element={<CampaignBuilder />} />
                        <Route path="/campaign/calendar" element={<CampaignCalendar />} />
                        <Route path="/campaign/materials" element={<CampaignMaterials />} />
                        <Route path="/campaign/attendance" element={<AttendanceTracker />} />
                        <Route path="/campaign/report" element={<CampaignReport />} />
                        <Route path="/campaign/aweh-ekse" element={<AwehEkseHub />} />

                        <Route path="/research" element={<ResearchPortal />} />
                        <Route path="/research/survey-builder" element={<SurveyBuilder />} />
                        <Route path="/research/take-survey" element={<SurveyTaker />} />
                        <Route path="/research/school" element={<SchoolDashboard />} />
                        <Route path="/research/export" element={<DataExport />} />

                        <Route path="/games" element={<GamesHome />} />
                        <Route path="/games/sync" element={<SyncCodeLobby />} />
                        <Route path="/games/ckn" element={<CKNHome />} />
                        <Route path="/games/ckn/solo" element={<CKNSolo />} />
                        <Route path="/games/ckn/multi" element={<CKNNulti />} />
                        <Route path="/games/ckn/paper" element={<CKNPaper />} />
                        <Route path="/games/ku" element={<KUHome />} />
                        <Route path="/games/ku/solo" element={<KUSolo />} />
                        <Route path="/games/ku/multi" element={<KUMulti />} />
                        <Route path="/games/ku/paper" element={<KUPaper />} />
                        <Route path="/games/bc" element={<BCHome />} />
                        <Route path="/games/bc/solo" element={<BCSolo />} />
                        <Route path="/games/bc/multi" element={<BCMulti />} />
                        <Route path="/games/bc/paper" element={<BCPaper />} />

                        <Route path="/achievements" element={<AchievementsHome />} />
                        <Route path="/achievements/:id" element={<BadgeDetail />} />

                        <Route path="/more" element={<More />} />

                        <Route path="*" element={
                          <div className="py-16 text-center">
                            <span className="text-5xl">🤷</span>
                            <h1 className="mt-4 text-xl font-bold text-stone-800">Page not found</h1>
                            <p className="mt-2 text-sm text-stone-500">The page you're looking for doesn't exist.</p>
                          </div>
                        } />
                      </Route>
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </RegionProvider>
              </FavoritesProvider>
            </ToastProvider>
          </SyncProvider>
        </ProfileProvider>
      </OfflineProvider>
    </ErrorBoundary>
  )
}
