import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const About = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#ff8c5a] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-center mb-4">
            About Us
          </h1>
          <p className="text-xl text-center text-orange-100 max-w-3xl mx-auto">
            ODIA INTERSTATE MIGRANT WORKERS UNION
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction Section */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-[#FF6B35]">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Who We Are
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4 text-justify">
              The <strong>Odia Interstate Migrant Workers Union (OIMWU)</strong> is a dedicated organization committed to safeguarding the rights, welfare, and dignity of Odia migrant workers across India. Established with the vision of creating a just and equitable society, we serve as a collective voice for thousands of migrant workers who contribute significantly to the nation's economy while often facing exploitation, discrimination, and marginalization.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed text-justify">
              Our union operates on the fundamental principles of solidarity, advocacy, and empowerment. We work tirelessly to ensure that every Odia migrant worker, regardless of their occupation, location, or employment status, has access to fair wages, safe working conditions, legal protection, and social security benefits. Through collective action and strategic partnerships, we strive to eliminate exploitative practices and promote the holistic development of migrant worker communities.
            </p>
          </div>
        </div>

        {/* Vision Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-8 rounded-xl shadow-md border-l-8 border-[#FF6B35]">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-12 h-12 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-[#FF6B35] mb-4">Our Vision</h2>
                <p className="text-lg text-gray-800 leading-relaxed text-justify">
                  To build a just, inclusive, and equitable society where Odia migrant workers are recognized as valued contributors to national development and enjoy dignity, equality, safety, and full recognition of their fundamental rights—both at their workplaces and within their communities. We envision a future where migration is a choice driven by opportunity rather than necessity, and where every worker is empowered to lead a life of respect and prosperity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-xl shadow-md border-l-8 border-gray-700">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-lg text-gray-800 leading-relaxed mb-4 text-justify">
                  Our mission is to protect, empower, and unite migrant workers through collective action, strategic advocacy, and unwavering solidarity. We are dedicated to creating sustainable change by addressing systemic inequalities and championing the cause of workers' rights at local, state, and national levels.
                </p>
                <p className="text-lg text-gray-800 leading-relaxed text-justify">
                  We are unequivocally committed to the eradication of child labour and bonded labour in all its forms. Furthermore, we endeavor to ensure that every Odia migrant worker has guaranteed access to fair and timely wages, safe and hygienic working conditions, comprehensive legal protection, robust social security coverage, and the opportunity to live a dignified life—irrespective of their geographical origin, employment sector, or contractual status.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Objectives Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Our Core Objectives
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-[#FF6B35]">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Advocacy & Representation</h3>
              <p className="text-gray-700 leading-relaxed">
                Representing migrant workers in negotiations with employers, government bodies, and policy-making forums to ensure their voices are heard and their concerns are addressed.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-[#FF6B35]">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Legal Protection</h3>
              <p className="text-gray-700 leading-relaxed">
                Providing comprehensive legal assistance, awareness programs, and support mechanisms to protect workers from exploitation, harassment, and unfair labor practices.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-[#FF6B35]">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Skill Development</h3>
              <p className="text-gray-700 leading-relaxed">
                Facilitating skill enhancement programs, vocational training, and certification initiatives to improve employability and career advancement opportunities for workers.
              </p>
            </div>
          </div>
        </div>

        {/* Union Advocacy Benefits Section */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Union Advocacy Benefits
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive rights and protections we advocate for on behalf of Odia migrant workers
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {/* Benefit 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-l-4 border-[#FF6B35] group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-[#FF6B35] transition-colors">
                  <span className="text-[#FF6B35] font-bold text-lg group-hover:text-white">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Fair Wages and Equal Treatment</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Ensuring equal remuneration for equal work, eliminating wage discrimination based on nationality, gender, caste, or any other factor, and guaranteeing timely payment of wages.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-l-4 border-[#FF6B35] group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-[#FF6B35] transition-colors">
                  <span className="text-[#FF6B35] font-bold text-lg group-hover:text-white">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Safe and Dignified Working Conditions</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Advocating for workplace safety standards, protection from occupational hazards, prevention of workplace accidents, and elimination of physical or verbal abuse.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-l-4 border-[#FF6B35] group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-[#FF6B35] transition-colors">
                  <span className="text-[#FF6B35] font-bold text-lg group-hover:text-white">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Decent Living Conditions</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Securing access to affordable and hygienic housing, clean drinking water, proper sanitation facilities, and other essential amenities for workers and their families.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-l-4 border-[#FF6B35] group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-[#FF6B35] transition-colors">
                  <span className="text-[#FF6B35] font-bold text-lg group-hover:text-white">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Social Protection and Healthcare</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Facilitating enrollment in health insurance schemes, social security programs, pension plans, and government welfare initiatives designed for workers.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 5 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-l-4 border-[#FF6B35] group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-[#FF6B35] transition-colors">
                  <span className="text-[#FF6B35] font-bold text-lg group-hover:text-white">5</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Access to Justice and Legal Support</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Establishing fair and accessible grievance redressal mechanisms, providing legal aid services, and ensuring protection against exploitation and injustice.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 6 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-l-4 border-[#FF6B35] group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-[#FF6B35] transition-colors">
                  <span className="text-[#FF6B35] font-bold text-lg group-hover:text-white">6</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ethical Recruitment and No Forced Labour</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Campaigning for the prohibition of exploitative recruitment agents, elimination of exorbitant recruitment fees, and complete eradication of bonded and forced labour practices.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 7 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-l-4 border-[#FF6B35] group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-[#FF6B35] transition-colors">
                  <span className="text-[#FF6B35] font-bold text-lg group-hover:text-white">7</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Freedom of Association and Collective Bargaining</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Upholding the fundamental right of workers to join or form trade unions, workers' associations, and engage in collective bargaining for better terms and conditions.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 8 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-l-4 border-[#FF6B35] group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-[#FF6B35] transition-colors">
                  <span className="text-[#FF6B35] font-bold text-lg group-hover:text-white">8</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Skill Recognition and Upgradation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Promoting formal recognition and certification of workers' skills, facilitating access to advanced training programs, and supporting continuous professional development.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 9 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-l-4 border-[#FF6B35] group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-[#FF6B35] transition-colors">
                  <span className="text-[#FF6B35] font-bold text-lg group-hover:text-white">9</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Regularization and Legal Status</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Advocating for the protection of undocumented workers, establishing clear pathways to regularization, and ensuring legal recognition of all migrant workers.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 10 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-l-4 border-[#FF6B35] group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-[#FF6B35] transition-colors">
                  <span className="text-[#FF6B35] font-bold text-lg group-hover:text-white">10</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Family and Community Rights</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Protecting the right to family unity, ensuring quality education for workers' children, promoting community integration, and fostering social cohesion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action - Only show if user is not logged in */}
        {!user && (
          <div className="bg-gradient-to-r from-[#FF6B35] to-[#ff8c5a] rounded-2xl shadow-2xl p-10 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Join Our Movement</h2>
            <p className="text-xl mb-6 text-orange-100 max-w-3xl mx-auto">
              Together, we can build a future where every Odia migrant worker is treated with dignity, respect, and fairness. Your membership strengthens our collective voice.
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-[#FF6B35] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Become a Member Today
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default About;

