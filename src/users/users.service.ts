import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const userCheck = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email
      }
    })
    if (userCheck) throw new ForbiddenException("User alredy exist")
    
    const hash = await this.hashData(createUserDto.password)
  
    const newUser = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        hashPassword: hash
      }
    })
    const { hashPassword, RThash, confirmed, locationId, ...userData } = newUser
    return userData
  }

  async hashData(data: string): Promise<string> {
    return await bcrypt.hash(data, 10)
  }





  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
