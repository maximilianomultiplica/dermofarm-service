import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoginDto, RegisterDto, TokenResponseDto, UserResponseDto } from '../dto/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const { email, password } = loginDto;
    
    // Buscar usuario por email
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    // Generar token JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const expiresIn = this.configService.get('JWT_EXPIRATION', '24h');
    
    return {
      accessToken: this.jwtService.sign(payload),
      tokenType: 'Bearer',
      expiresIn: 3600, // 1 hora en segundos
    };
  }

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    const { email } = registerDto;
    
    // Verificar si el email ya está registrado
    const existingUser = await this.userRepository.findOne({ where: { email } });
    
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }
    
    // Crear nuevo usuario
    const user = this.userRepository.create(registerDto);
    await this.userRepository.save(user);
    
    // Omitir contraseña en la respuesta
    const { password, ...result } = user;
    
    return result as UserResponseDto;
  }

  async getProfile(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    
    // Omitir contraseña en la respuesta
    const { password, ...result } = user;
    
    return result as UserResponseDto;
  }
}