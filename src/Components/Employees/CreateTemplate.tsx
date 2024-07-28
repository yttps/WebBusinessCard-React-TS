import React, { useEffect, useState, useRef, ChangeEvent, useCallback, useMemo } from "react";
import '@/Components/Employees/CSS/createTemplate.css'
import Header from "@/Components/Header/Header";

import { Card, Col, Form, Row } from 'react-bootstrap';
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { TemplateApi } from "@/ApiEndpoints/TemplateApi";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { CompanyApi } from "@/ApiEndpoints/CompanyApi";

const CreateTemplate: React.FC = () => {

  const templateapi = new TemplateApi();

  const nav = useNavigate();
  const companyapi = useMemo(() => new CompanyApi(), []);
  const [getLogoCompany, setGetLogoCompany] = useState('');
  const [getCompanyId, setGetcompanyId] = useState<string | ''>('');
  const [logo, setLogo] = useState<File | null>(null);
  const [background, setBackground] = useState<File | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | ''>('');
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [fontSize, setFontSize] = useState('15');
  const [canvasHistory, setCanvasHistory] = useState<(CanvasOperation | null)[]>([]);
  const [nameTemplate, setNameTemplate] = useState<string>('');

  const logoInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const setNameTem = (e: ChangeEvent<HTMLFormElement>) => {
    console.log(e.target.value);
    setNameTemplate(e.target.value);
  };

  useEffect(() => {

    if (background) {

      console.log('check file', background.size);
      const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;

      if (canvas) {

        const ctx = canvas.getContext('2d');

        if (ctx) {

          const reader = new FileReader();

          reader.onload = (e) => {

            const img = new Image();

            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = e.target?.result as string;
          };
          reader.readAsDataURL(background);
        } else {
          console.error('Failed to get 2D context from canvas');
        }
      }
    }
  }, [background]);

  //add color for single text
  const [allPositions, setAllPositions] = useState<AllPosition>({
    "fullname": { x: 0, y: 0, fontSize: '0', fontColor: '#000000' },
    "companyName": { x: 0, y: 0, fontSize: '0', fontColor: '#000000' },
    "companyAddress": { x: 0, y: 0, fontSize: '0', fontColor: '#000000' },
    "position": { x: 0, y: 0, fontSize: '0', fontColor: '#000000' },
    "email": { x: 0, y: 0, fontSize: '0', fontColor: '#000000' },
    "phoneDepartment": { x: 0, y: 0, fontSize: '0', fontColor: '#000000' },
    "phone": { x: 0, y: 0, fontSize: '0', fontColor: '#000000' },
    "departmentName": { x: 0, y: 0, fontSize: '0', fontColor: '#000000' },
    "logo": { x: 0, y: 0, fontSize: '0', fontColor: '#000000' }
  });



  interface CanvasOperation {
    type: 'text' | 'image';
    data: string;
    position: { x: number; y: number };
  }

  type TextPosition = {
    x: number;
    y: number;
    fontSize: string;
    fontColor: string;
  };

  type AllPosition = {
    [key: string]: TextPosition;
  };

  const textMappings: { [key: string]: string } = {
    "fullname": "Firstname Lastname",
    "companyName": "Company",
    "companyAddress": "Company Address",
    "position": "Position",
    "email": "Personal email",
    "phoneDepartment": "Phone Department",
    "phone": "Phone personal",
    "departmentName": "Department Name"
  };



  //STEP 1 WHEN CLICK AND DRAGGING
  const handleDragStart = (event: React.DragEvent, item: string) => {

    //add check positions alls value 
    const allPositionsNotNull = Object.values(allPositions).every(
      position => position.x !== 0 && position.y !== 0
    );

    if (allPositionsNotNull) {
      Swal.fire({
        title: 'Error!',
        text: 'กำหนดค่าครบแล้ว!',
        icon: 'error',
      });
      return;
    }

    console.log('USE START');
    event.dataTransfer.setData("text", item);
    setDraggedItem(item);

    const dragText = document.createElement("div");
    dragText.style.position = "absolute";
    dragText.style.top = "-99999px";
    dragText.style.fontSize = `${fontSize}px`;
    dragText.style.color = selectedColor;
    dragText.innerText = textMappings[item];
    document.body.appendChild(dragText);
    event.dataTransfer.setDragImage(dragText, 0, 0);

    setTimeout(() => {
      document.body.removeChild(dragText);
    }, 0);
  }


  const handleDragStartLogo = (event: React.DragEvent, item: string) => {

    const allPositionsNotNull = Object.values(allPositions).every(
      position => position.x !== 0 && position.y !== 0
    );

    if (allPositionsNotNull) {
      Swal.fire({
        title: 'Error!',
        text: 'กำหนดค่าครบแล้ว!',
        icon: 'error',
      });
      return;
    }

    console.log('USE DRAG');
    event.dataTransfer.setData("image", item);
    setDraggedItem(item);
  }

  //STEP 2 ON WHEN DRAGGING ON CANVAS AREA
  const handleDragOver = (e: React.DragEvent) => {
    console.log('USE DRAG OVER');
    e.preventDefault();
    const canvas = e.currentTarget as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log('from logging', x, y);

  }

  //STEP 3 WHEN DROP OBJECT
  const handleDrop = (event: React.DragEvent) => {
    console.log('USE DRAG DROP');
    event.preventDefault();

    const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const canvasTarget = event.currentTarget as HTMLCanvasElement;
    const rect = canvasTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    if (ctx) {
      if (textMappings[draggedItem]) {
        const draggedPosition = allPositions[draggedItem];

        if (draggedPosition && (draggedPosition.x !== 0 || draggedPosition.y !== 0)) {
          Swal.fire({
            title: 'Error!',
            text: `${draggedItem} ถูกเซ็ตค่าแล้ว!`,
            icon: 'error',
          });
          return;
        }

        const text = textMappings[draggedItem];
        ctx.fillStyle = selectedColor || draggedPosition.fontColor; // Use the color from the state
        ctx.textBaseline = 'middle';
        ctx.font = (fontSize || draggedPosition.fontSize) + 'px Bold'; // Use the size from the state
        ctx.fillText(text, scaledX + 30, scaledY + 33);
        addToCanvasHistory({ type: 'text', data: text, position: { x: scaledX + 30, y: scaledY + 33 } });

        setAllPositions(prevPositions => ({
          ...prevPositions,
          [draggedItem]: { x: scaledX, y: scaledY + 40, fontSize: fontSize || draggedPosition.fontSize, fontColor: selectedColor || draggedPosition.fontColor },
        }));
      } else if (draggedItem === 'image' && getLogoCompany) {
        console.log('Image loaded, drawing at:', x, y);

        const draggedPosition = allPositions[draggedItem];

        if (draggedPosition && (draggedPosition.x !== 0 || draggedPosition.y !== 0)) {
          Swal.fire({
            title: 'Error!',
            text: `${draggedItem} ถูกเซ็ตค่าแล้ว!`,
            icon: 'error',
          });
          return;
        }

        const image = new Image();
        image.src = getLogoCompany;

        const width = 220;
        const height = 120;

        image.onload = () => {
          ctx.drawImage(image, scaledX - 110, scaledY - 60, width, height);

          setAllPositions(prevPositions => ({
            ...prevPositions,
            ['logo']: { x: scaledX - 110, y: scaledY - 60, fontSize: width.toString(), fontColor: '' },
          }));

          addToCanvasHistory({
            type: 'image',
            data: getLogoCompany,
            position: { x: scaledX - 110, y: scaledY - 50 },
          });
        };
      }
    }
    setDraggedItem('');
  };


  // Function to add operation to canvas history
  const addToCanvasHistory = (operation: CanvasOperation) => {
    setCanvasHistory([...canvasHistory, operation]);
  }

  const handleReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    e.preventDefault();

    setLogo(null);
    setBackground(null);

    setAllPositions({
      "fullname": { x: 0, y: 0, fontSize: '0', fontColor: '#000000' },
      "companyName": { x: 0, y: 0, fontSize: '0', fontColor: '#000000' },
      "companyAddress": { x: 0, y: 0, fontSize: '0', fontColor: '#000000' },
      "position": { x: 0, y: 0, fontSize: '0', fontColor: '#000000' },
      "email": { x: 0, y: 0, fontSize: '0', fontColor: '#000000' },
      "phoneDepartment": { x: 0, y: 0, fontSize: '0', fontColor: '#000000' },
      "phone": { x: 0, y: 0, fontSize: '0', fontColor: '#000000' },
      "departmentName": { x: 0, y: 0, fontSize: '0', fontColor: '#000000' },
      "logo": { x: 0, y: 0, fontSize: '0', fontColor: '#000000' }
    });

    setCanvasHistory([]);
    // Clear the canvas
    const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
    if (backgroundInputRef.current) {
      backgroundInputRef.current.value = "";
    }
  }


  // const handleUndo = () => {
  //   if (canvasHistory.length > 0) {
  //     const updatedHistory = [...canvasHistory];
  //     const lastOperation = updatedHistory.pop(); 
  //     setCanvasHistory(updatedHistory);

  //     const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
  //     const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     if (background) {
  //       const img = new Image();
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         img.onload = () => {
  //           canvas.width = img.width;
  //           canvas.height = img.height;
  //           ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  //           // Redraw all text operations
  //           updatedHistory.forEach(operation => {
  //             if (operation && operation.type === 'text') {
  //               ctx.fillStyle = selectedColor;
  //               ctx.textBaseline = 'middle';
  //               ctx.font = fontSize + 'px Arial';
  //               ctx.fillText(operation.data, operation.position.x, operation.position.y);
  //             }
  //           });
  //         };
  //         img.src = e.target?.result as string;
  //       };
  //       reader.readAsDataURL(background);
  //     }

  //     // Remove the position of the undone text
  //     if (lastOperation && lastOperation.type === 'text') {
  //       setAllPositions(prevPositions => {
  //         const newPositions = { ...prevPositions };
  //         delete newPositions[lastOperation.data];
  //         return newPositions;
  //       });
  //     }
  //   }
  // };

  const handleSizeFonstChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(event.target.value);
    console.log('size', fontSize);
  }

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value);
    console.log('Color', selectedColor);
  }

  const handleImageBackgroundChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (file) {

      if (file.size > 5 * 1024 * 1024) {

        if (backgroundInputRef.current) {

          backgroundInputRef.current.value = "";
          Swal.fire({
            title: 'Error!',
            text: 'โปรดเลือกไฟล์ไม่เกิน 5 MB!',
            icon: 'error',
          });

          return;
        }
      }
      setBackground(file);
    }
  }

  const handleUploadTemplate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    e.preventDefault();

    const uploadBtn = document.getElementById('uploadBtn') as HTMLButtonElement;
    const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;


    if (background && getLogoCompany) {

      const allPositionsNotNull = Object.values(allPositions).every(
        position => position.x !== 0 && position.y !== 0
      );

      if (!allPositionsNotNull || nameTemplate == '') {
        Swal.fire({
          title: 'Error!',
          text: 'กรุณากำหนดค่าให้ครบ!',
          icon: 'error',
        });
        return;
      }

      uploadBtn.style.visibility = 'hidden';
      resetBtn.style.visibility = 'hidden';
      setLoading(true);

      const status = '0';
      const uidTemplate = await uploadTemplateCompany(nameTemplate, getCompanyId, allPositions, status, fontSize, selectedColor)

      if (uidTemplate) {

        const resUrlTemplate = await uploadBgCompany(background, uidTemplate);

        if (resUrlTemplate) {

          setLoading(false);
          const res = await Swal.fire({
            title: 'Success!',
            text: 'สร้างเทมเพลตสำเร็จ!',
            icon: 'success',
          });

          if (res) {
            nav('/ListEmployees', { replace: true });
            window.location.reload();
          }
        }
      }

      if (!background && !logo) {

        setLoading(false);
        Swal.fire({
          title: 'Error!',
          text: 'สร้างเทมเพลตล้มเหลว!',
          icon: 'error',
        });
        return;
      }
    }
    else {

      setLoading(false);
      Swal.fire({
        title: 'Error!',
        text: 'โปรดเลือกพื้นหลัง!',
        icon: 'error',
      });
      return;
    }
  }

  const uploadTemplateCompany = async (nameTemplate: string, getCompanyId: string, allPositions: AllPosition,
    status: string, fontSize: string, selectedColor: string): Promise<string | undefined> => {

    try {

      const res = await templateapi.uploadTemplateCompany(nameTemplate, getCompanyId, allPositions, status, fontSize, selectedColor);

      return res;

    } catch (error) {
      console.error(error);
    }
  }


  const uploadBgCompany = async (background: File, uidTemplate: string) => {

    try {

      const folderName = 'background';
      const collection = 'templates';
      const res = await templateapi.uploadBgTemplate(background, uidTemplate, folderName, collection);
      return res;

    } catch (error) {
      console.error(error);
    }
  }

  const getDataCompanyById = useCallback(async (companyId: string) => {
    const res = await companyapi.GetDataCompanyById(companyId);

    if (res) {
      setGetLogoCompany(res.logo);
    }
  }, [companyapi]);

  useEffect(() => {

    const loggedInData = localStorage.getItem("LoggedIn");

    if (loggedInData) {

      const parsedData = JSON.parse(loggedInData);
      const CompanyId = parsedData.companyId;

      if (CompanyId) {
        setGetcompanyId(CompanyId);
        getDataCompanyById(CompanyId);
      }
    }
  }, [allPositions, getDataCompanyById])

  console.log(allPositions);


  return (
    <>
      <Header />
      <div>
        {/* col-1*/}
        <Row>
          <Col>
            <div className="bg-blue-500 text-white border border-solid border-gray-300 p-4 w-full h-full">
              <h2 className="text-lg font-bold mb-4">รายละเอียดข้อมูล</h2>
              <div className="mb-2">
                <p className="text-muted-foreground">ชื่อเทมเพลต</p>
                <Form onChange={setNameTem}>
                  <Form.Group className="mb-0">
                    <Form.Control
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      type="text"
                      required />
                  </Form.Group>
                </Form>
              </div>
              <div className="md-4 grid grid-cols-2 gap-4">
                {Object.keys(textMappings).map((item, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    className="mb-[-20px]"
                    style={{ backgroundColor: "transparent" }}>
                    <Card style={{ width: '12rem', textAlign: 'center', height: '5rem', margin: '0 auto' }}>
                      <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Card.Title style={{ fontSize: '15px' }}>{item}</Card.Title>
                        <CIcon icon={icon.cilText} size="xl" className="text-success" />
                      </Card.Body>
                    </Card>
                    <br />
                  </div>
                ))}
              </div>
              <br />
            </div>

            {/* col-2*/}
          </Col>
          <Col xs={6}>
            <div className="flex-1 bg-gray-100 border-l border-zinc-300 pl-4 pt-4 pb-5">
              <h1 className="text-xl font-bold mb-4">Preview Template</h1>
              <br />
              <hr />
              {background ? (
                <div id="div-1">
                  <canvas
                    className="scroll-ml-20px ml-[20px]"
                    id="imageCanvas"
                    width="850px"
                    height="410px"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}>
                  </canvas>
                </div>
              ) : (
                <div id="div-1" className="flex justify-center items-center">
                  <img
                    src="https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
                    alt=""
                    style={{ width: '31rem', height: '35rem', paddingTop: '5rem' }} />
                </div>
              )}
            </div>


            {/* col-3*/}
          </Col>
          <Col>
            <div className="w-max bg-white border border-solid border-gray-300 p-4">
              <h2 className="text-lg font-bold mb-4">Font size & Pick Color</h2>
              <div className="md-4 grid grid-cols-2 gap-4">
                <Card style={{ width: '12rem', textAlign: 'center' }}>
                  <Card.Body>
                    <Card.Title style={{ fontSize: '15px' }}>Font size</Card.Title>
                    <input
                      type="range"
                      id="size-slider"
                      min="15"
                      max="100"
                      value={fontSize}
                      onChange={handleSizeFonstChange} />
                    <h6>{fontSize}</h6>
                  </Card.Body>
                </Card>
                <Card style={{ width: '12rem', textAlign: 'center' }}>
                  <Card.Body>
                    <Card.Title style={{ fontSize: '15px' }}>Color</Card.Title>
                    <input
                      type="color"
                      id="colorpicker"
                      value={selectedColor}
                      onChange={handleColorChange} />
                  </Card.Body>
                </Card>
              </div>
              <br />
              <h2 className="text-lg font-bold mb-4">Preview Logo</h2>
              <div className="flex justify-center items-center">
                <div draggable onDragStart={(e: React.DragEvent) => handleDragStartLogo(e, 'image')}>
                  <Card style={{ width: '15rem', textAlign: 'center' }}>
                    <Card.Body>
                      <Card.Title style={{ fontSize: '15px' }}>Preview Logo</Card.Title>
                      <hr />
                      <div id="preview-logo">
                        {getLogoCompany && <img src={getLogoCompany} alt="Logo Preview" style={{ maxWidth: '100%' }} />}
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
              <br />
              <h2 className="text-lg font-bold mb-4">Selected Background</h2>
              <div className="flex justify-center items-center">
                <Card style={{ width: '20rem', textAlign: 'center' }}>
                  <Card.Body className="w-[20rem]">
                    <Card.Title style={{ fontSize: '15px' }}>Upload Background</Card.Title>
                    <hr />
                    <form>
                      <input
                        type="file"
                        id="img"
                        ref={backgroundInputRef}
                        className="w-[12rem]"
                        accept="image/*"
                        onChange={handleImageBackgroundChange} />
                    </form>
                  </Card.Body>
                </Card>
              </div>
              <br />
              <button id='resetBtn' onClick={handleReset} className="bg-danger text-secondary-foreground hover:bg-secondary/80 w-full py-2 mb-2">Reset</button>
              <button id='uploadBtn' onClick={handleUploadTemplate} className="bg-success text-primary-foreground hover:bg-primary/80 w-full py-2">Upload Template</button>
              {loading ?
                <div className='flex justify-content-end'>
                  <h1>กำลังตรวจสอบข้อมูล </h1>
                  &nbsp;
                  <l-tail-chase
                    size="15"
                    speed="1.75"
                    color="black"
                  ></l-tail-chase>
                </div>
                : <div></div>}
            </div>
          </Col>
        </Row>



        {/* <div className="min-h-screen h-[160vh] rounded-lg px-3 p-6 py-4 overflow-y-hidden bg-card bg-gray-50 shadow-lg dark:bg-gray-800">
          <div className="grid grid-cols-3 gap-4 h-full">
          </div>
        </div> */}
      </div>
    </>
  );
}

export default CreateTemplate;



