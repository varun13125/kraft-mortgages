import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HomeIcon, Calculator, Users, TrendingUp, Star, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HomeIcon className="h-8 w-8 text-navy" />
            <h1 className="text-2xl font-bold text-navy">Kraft Mortgages</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#services" className="text-charcoal hover:text-navy transition-colors">Services</a>
            <a href="#about" className="text-charcoal hover:text-navy transition-colors">About</a>
            <a href="#contact" className="text-charcoal hover:text-navy transition-colors">Contact</a>
            <Button>Get Started</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-6">Trusted by 10,000+ Homeowners</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-navy mb-6">
            Your Dream Home
            <br />
            <span className="text-blue-600">Starts Here</span>
          </h1>
          <p className="text-xl text-charcoal mb-8 max-w-3xl mx-auto">
            Expert mortgage guidance, competitive rates, and personalized service to help you secure the perfect home loan. 
            From first-time buyers to refinancing, we're here every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-navy hover:bg-navy-light text-white px-8 py-3">
              Calculate Your Rate
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3">
              Speak with an Expert
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Our Services</h2>
            <p className="text-charcoal max-w-2xl mx-auto">
              Comprehensive mortgage solutions tailored to your unique financial situation and homeownership goals.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calculator className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Purchase Loans</CardTitle>
                <CardDescription>
                  First-time buyer or moving up? We offer competitive rates for conventional, FHA, VA, and USDA loans.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Conventional Loans
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    FHA Loans
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    VA Loans
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Refinancing</CardTitle>
                <CardDescription>
                  Lower your monthly payments, reduce your loan term, or tap into your home's equity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Rate & Term Refinance
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Cash-Out Refinance
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    FHA Streamline
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Expert Consultation</CardTitle>
                <CardDescription>
                  Personalized guidance from experienced loan officers who understand your local market.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Pre-qualification
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Credit Analysis
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Market Insights
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-navy text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">$2.5B+</div>
              <div className="text-blue-200">Loans Funded</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-200">Happy Families</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9</div>
              <div className="text-blue-200 flex items-center justify-center">
                <Star className="h-4 w-4 mr-1 fill-current" />
                Average Rating
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15</div>
              <div className="text-blue-200">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-navy text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Take the first step towards homeownership or refinancing. Our team is ready to help you find the perfect mortgage solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Apply Now
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 border-white text-white hover:bg-white hover:text-navy">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <HomeIcon className="h-6 w-6" />
                <span className="text-xl font-bold">Kraft Mortgages</span>
              </div>
              <p className="text-gray-300 text-sm">
                Your trusted partner in homeownership, providing expert mortgage guidance and competitive rates.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Purchase Loans</li>
                <li>Refinancing</li>
                <li>FHA Loans</li>
                <li>VA Loans</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>About Us</li>
                <li>Our Team</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div>1-800-KRAFT-MO</div>
                <div>info@kraftmortgages.com</div>
                <div>Licensed in 50 states</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Kraft Mortgages. All rights reserved. NMLS #123456</p>
          </div>
        </div>
      </footer>
    </div>
  )
}