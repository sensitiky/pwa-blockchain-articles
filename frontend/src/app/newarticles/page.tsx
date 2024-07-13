import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header2 from "@/assets/header2"
import Footer from "@/assets/footer"

export default function NewArticles() {
  return (
    <div className="min-w-full bg-gradient6 container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <Header2/>
      <h1 className="text-3xl font-bold mb-6">Create a Blog Post</h1>
      <form className="space-y-6 mb-52">
        <div>
          <label htmlFor="category" className="block font-medium mb-2">
            Category
          </label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="educational">Educational</SelectItem>
              <SelectItem value="tutorial">Tutorial</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="case-study">Case Study</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
              <SelectItem value="journalist">Journalist</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="blockchain" className="block font-medium mb-2">
            Discuss a specific blockchain?
          </label>
          <Checkbox id="blockchain" />
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="blockchain-tags" className="block font-medium mb-2">
              Blockchain Tags
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select blockchain tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bitcoin">Bitcoin</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="cardano">Cardano</SelectItem>
                <SelectItem value="polkadot">Polkadot</SelectItem>
                <SelectItem value="avalanche">Avalanche</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label htmlFor="content" className="block font-medium mb-2">
            Content
          </label>
          <div className="flex flex-col gap-4">
            {/*Poner enriquecedor de texto y capacidad de cargarle texto*/}
            <div className="h-[200px]" />
            
            <div className="flex items-center gap-2">
              <Button variant="secondary">Upload Image</Button>
              <div className="flex-1">
                <Input type="text" placeholder="Add image caption" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <Button variant="secondary">Cancel</Button>
          <Button variant="outline">Save Draft</Button>
          <Button>Publish</Button>
        </div>
      </form>
      <Footer/>
    </div>
  )
}