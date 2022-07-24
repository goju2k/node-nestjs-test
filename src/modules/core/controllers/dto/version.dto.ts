import { ApiProperty } from "@nestjs/swagger"

class MyBodyElement{
  ccc: string
}
export class MyBody{
  aaa: number
  bbb: MyBodyElement
}

export class MyBody2{

  /**
   * ddd 는 무엇인가???
   */
  ddd: number
  
  bbb: MyBodyElement
}