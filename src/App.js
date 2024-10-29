
import Sidebar from './commonComponents/SideBar';

function App() {
  return (
    // <Router>
    //         <Routes>
    //             <Route path="/" element={<Navigate to="/scheduleappointment" replace />} />
    //             <Route path="/admin" element={<HomePage />} />
    //             <Route path="/signup" element={<SignUpPage />} />
    //             <Route path="/signin" element={<SignInPage />} />
    //             <Route path="/onboarding" element={<OnBoarding />} />
    //             <Route path="/settings" element={<SettingsPage />} />
    //             <Route path="/teammanagement" element={<TeamManagementPage />} />
    //             <Route path="/corporatedashboard" element={<CorporateDashboardPage />} />
    //             <Route path="/groupmetrics" element={<GroupMetricsPage />} />
    //             <Route path="/statistics" element={<StatisticsPage />} />
    //         </Routes>
    //     </Router>
    <div className='h-screen flex overflow-hidden bg-backgroundcolor'>
      {/* Sidebar */}
      <Sidebar />
      
      
    </div>
  );
}

export default App;
