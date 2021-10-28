import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"

describe('When I am on Bills page but it is loading', () => {
    test(('Then, Loading page should be rendered'), () => {
      const html = BillsUI({loading:true})
      document.body.innerHTML = html
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })

describe('When I am on Bills page but back-end send error message',()=>{
    test('then, error page should be rendered',()=>{
      const html=BillsUI({error:'some error message'})
      document.body.innerHTML=html
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })