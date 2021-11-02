import { fireEvent, getByTestId, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES } from "../constants/routes"



describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then form new bill must be displayed", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const form=screen.getByTestId("form-new-bill")
      expect(form).toBeTruthy()
    })
    test("Then i click on chose file should chose  file",()=>{
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      window.alert = () => {};
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const firestore=null
      const newBill=new NewBill({document,onNavigate,firestore,localStorage: window.localStorage})
      const html=NewBillUI()
      document.body.innerHTML=html
      const handelChangeFile1=jest.fn((e)=>newBill.handleChangeFile(e))
      const file=screen.getByTestId("file")
      file.addEventListener("change",handelChangeFile1)
      fireEvent.change(file)
      expect(handelChangeFile1).toHaveBeenCalled()
    })
    test("Then i click on submit button submit the bill",()=>{
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const firestore=null
      const newBill=new NewBill({document,onNavigate,firestore,localStorage: window.localStorage})
      const html=NewBillUI()
      document.body.innerHTML=html
      const handleSubmit1=jest.fn((e)=>newBill.handleSubmit(e))
      const submit=screen.getByTestId("form-new-bill")
      submit.addEventListener("submit",handleSubmit1)
     fireEvent.submit(submit)
      expect(handleSubmit1).toHaveBeenCalled()
    })
    // test("then i click on submit button datepicker should have value",()=>{
    //   const onNavigate = (pathname) => {
    //     document.body.innerHTML = ROUTES({ pathname })
    //   }
    //   Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    //   window.localStorage.setItem('user', JSON.stringify({
    //     type: 'Employee'
    //   }))
    //   const firestore=null
    //   const newBill=new NewBill({document,onNavigate,firestore,localStorage: window.localStorage})
    //   const html=NewBillUI()
    //   document.body.innerHTML=html
    //   const handleSubmit1=jest.fn((e)=>newBill.handleSubmit(e))
    //   const submit=screen.getByTestId("form-new-bill")
    //   submit.addEventListener("submit",handleSubmit1)
    //  fireEvent.submit(submit)

    // })
  })
})