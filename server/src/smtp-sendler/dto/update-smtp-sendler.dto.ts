import { PartialType } from '@nestjs/swagger';
import { CreateSmtpSendlerDto } from './create-smtp-sendler.dto';

export class UpdateSmtpSendlerDto extends PartialType(CreateSmtpSendlerDto) {}
