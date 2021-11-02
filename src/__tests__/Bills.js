import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import {ROUTES} from "../constants/routes"
import firebase from "../__mocks__/firebase"
import { localStorageMock } from "../__mocks__/localStorage.js"
import Bills from "../containers/Bills.js"
import userEvent from "@testing-library/user-event"
import VerticalLayout from "../views/VerticalLayout.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = VerticalLayout(120)
      document.body.innerHTML = html
      //to-do write expect expression
      expect(screen.getByText('Billed')).toBeTruthy()
    })
    test("Then there is no bills should tabel be empty",()=>{
      const onNavigate=(pathname)=>{
        document.body.innerHTML=ROUTES({pathname})
      }
      Object.defineProperty(window,'localStorage',{value:localStorageMock})
      window.localStorage.setItem('user',JSON.stringify({
        type:'Employee'
      }))
      const bill=new Bills({
      document,onNavigate,firestore:null,localStorage:window.localStorage})
      const getBill=jest.fn(bill.getBills())
      expect(getBill).toHaveReturnedTimes(0)
    })
    test("Then i click on Action icon modal should be open", ()=>{
      const onNavigate=(pathname)=>{
        document.body.innerHTML=ROUTES({pathname})
      }
      Object.defineProperty(window,'localStorage',{value:localStorageMock})
      window.localStorage.setItem('user',JSON.stringify({
        type:'Employee'
      }))
      const bill=new Bills({
      document,onNavigate,firestore:null,localStorage:window.localStorage})
      const html=BillsUI({data:bills})
      document.body.innerHTML=html
      const icons=screen.getAllByTestId('icon-eye')
      const handleClickIconEye1=jest.fn(bill.handleClickIconEye(icons[0]))
      icons[0].addEventListener('click',handleClickIconEye1)
      userEvent.click(icons[0])
      expect(handleClickIconEye1).toHaveBeenCalled()
      const modale=screen.getByTestId("modal-fade")
      expect(modale).toBeTruthy()

    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => b-a
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    describe("when i am on Bills Page and i click on new Bill Button",()=>{
      test("Then form new bill should be open",()=>{
          const onNavigate=(pathname)=>{
            document.body.innerHTML=ROUTES({pathname})
          }
          Object.defineProperty(window,'localStorage', {value :localStorageMock})
          window.localStorage.setItem('user',JSON.stringify({
            type:'Employee'
          }))
          const bill=new Bills({
            document,onNavigate,firestore:null,localStorage:window.localStorage})
          const html=BillsUI({data:bills})
          document.body.innerHTML=html
          const buttonNewBill=screen.getByTestId('btn-new-bill')
          const handleClickNewBill=jest.fn((e)=>bill.handleClickNewBill(e))
          const getbills=jest.fn(bill.getBills())
          buttonNewBill.addEventListener('click',handleClickNewBill)
          userEvent.click(buttonNewBill)
          expect(handleClickNewBill).toHaveBeenCalled()
          
      })
    })
  })
})

//test d'intégration Get
describe("Given I am connected as Employee",()=>{
  describe("When I navigate to bills page",()=>{
    test("fetches bills from mock API GET", async () => {
      const getSpy = jest.spyOn(firebase, "get")
      const bills = await firebase.get()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(4)
   })
   test("fetches bills from an API and fails with 404 message error", async () => {
    firebase.get.mockImplementationOnce(() =>
      Promise.reject(new Error("Erreur 404"))
    )
    const html = BillsUI({ error: "Erreur 404" })
    document.body.innerHTML = html
    const message = await screen.getByText(/Erreur 404/)
    expect(message).toBeTruthy()
  })
  test("fetches messages from an API and fails with 500 message error", async () => {
    firebase.get.mockImplementationOnce(() =>
      Promise.reject(new Error("Erreur 500"))
    )
    const html = BillsUI({ error: "Erreur 500" })
    document.body.innerHTML = html
    const message = await screen.getByText(/Erreur 500/)
    expect(message).toBeTruthy()
  })
  })
})

