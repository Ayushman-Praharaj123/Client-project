const About = () => {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          About ODIA INTERSTATE MIGRANT WORKERS UNION
        </h1>

        <div className="prose prose-lg max-w-none space-y-8 text-gray-700">
          {/* Vision Section */}
          <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-[#FF6B35]">
            <h2 className="text-3xl font-bold text-[#FF6B35] mb-4">OUR VISION</h2>
            <p className="text-lg leading-relaxed">
              To build a just and inclusive society where odia migrant workers enjoy dignity, equality, safety, and full recognition of their rights both at home and at work.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">OUR MISSION</h2>
            <p className="text-lg leading-relaxed mb-4">
              Our mission is to protect, empower, and unite migrant workers through collective action, advocacy, and solidarity.
            </p>
            <p className="text-lg leading-relaxed">
              We are committed to ending child labour and bonded labour, and to ensuring that every Odia migrant worker has access to fair wages, safe working conditions, legal protection, social security, and a dignified life, regardless of their origin, sector, or employment status.
            </p>
          </div>

          {/* Union Advocacy Benefits Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              UNION ADVOCACY BENEFIT OF ODIA MIGRANT WORKERS
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Benefit 1 */}
              <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-[#FF6B35]">
                <h3 className="text-xl font-bold text-gray-900 mb-2">1. Fair Wages and Equal Treatment</h3>
                <p className="text-gray-700">Equal pay for equal work, regardless of nationality or gender.</p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-[#FF6B35]">
                <h3 className="text-xl font-bold text-gray-900 mb-2">2. Safe and Dignified Working Conditions</h3>
                <p className="text-gray-700">Protection from occupational hazards, accidents, and abuse.</p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-[#FF6B35]">
                <h3 className="text-xl font-bold text-gray-900 mb-2">3. Decent Living Conditions</h3>
                <p className="text-gray-700">Access to affordable housing, sanitation, and basic amenities.</p>
              </div>

              {/* Benefit 4 */}
              <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-[#FF6B35]">
                <h3 className="text-xl font-bold text-gray-900 mb-2">4. Social Protection and Health Care</h3>
                <p className="text-gray-700">Inclusion in health insurance, social security, and welfare schemes.</p>
              </div>

              {/* Benefit 5 */}
              <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-[#FF6B35]">
                <h3 className="text-xl font-bold text-gray-900 mb-2">5. Access to Justice and Legal Support</h3>
                <p className="text-gray-700">Fair grievance redresses mechanisms and protection against exploitation.</p>
              </div>

              {/* Benefit 6 */}
              <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-[#FF6B35]">
                <h3 className="text-xl font-bold text-gray-900 mb-2">6. Ethical Recruitment and No Forced Labour</h3>
                <p className="text-gray-700">Ban on exploitative agents, high recruitment fees, and bonded labour.</p>
              </div>

              {/* Benefit 7 */}
              <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-[#FF6B35]">
                <h3 className="text-xl font-bold text-gray-900 mb-2">7. Freedom of Association and Collective Bargaining</h3>
                <p className="text-gray-700">Right to join or form unions or associations.</p>
              </div>

              {/* Benefit 8 */}
              <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-[#FF6B35]">
                <h3 className="text-xl font-bold text-gray-900 mb-2">8. Skill Recognition and Upgradation</h3>
                <p className="text-gray-700">Certification of skills and access to training programs.</p>
              </div>

              {/* Benefit 9 */}
              <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-[#FF6B35]">
                <h3 className="text-xl font-bold text-gray-900 mb-2">9. Regularisation and Legal Status</h3>
                <p className="text-gray-700">Protection of undocumented workers and pathways to regularisation.</p>
              </div>

              {/* Benefit 10 */}
              <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-[#FF6B35]">
                <h3 className="text-xl font-bold text-gray-900 mb-2">10. Family and Community Rights</h3>
                <p className="text-gray-700">Right to family unity, education for children, and community inclusion.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

